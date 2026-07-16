const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const calculateTotalAmount = async (items) => {
  if (!items || items.length === 0) {
    return 0;
  }

  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select("price");
  const productPriceMap = new Map(
    products.map((product) => [product._id.toString(), product.price])
  );

  return items.reduce((total, item) => {
    const price = productPriceMap.get(item.product.toString()) || 0;
    return total + price * item.quantity;
  }, 0);
};

const populateCart = (cart) => {
  return cart.populate({
    path: "items.product",
    select: "name price image stock category status seller",
  });
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalAmount: 0,
    });
  }

  return cart;
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Number(req.body.quantity || 1);

    if (!productId || !isValidObjectId(productId)) {
      return sendError(res, 400, "Valid productId is required");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return sendError(res, 400, "Quantity must be a positive whole number");
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    if (product.status && product.status !== "Active") {
      return sendError(res, 400, "Product is not available");
    }

    if (product.stock < quantity) {
      return sendError(res, 400, "Insufficient product stock");
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (item) {
      const updatedQuantity = item.quantity + quantity;

      if (product.stock < updatedQuantity) {
        return sendError(res, 400, "Insufficient product stock");
      }

      item.quantity = updatedQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await populateCart(cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await populateCart(cart);

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Number(req.body.quantity);

    if (!productId || !isValidObjectId(productId)) {
      return sendError(res, 400, "Valid productId is required");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return sendError(res, 400, "Quantity must be a positive whole number");
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    if (product.stock < quantity) {
      return sendError(res, 400, "Insufficient product stock");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendError(res, 404, "Cart not found");
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return sendError(res, 404, "Product is not in cart");
    }

    item.quantity = quantity;
    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await populateCart(cart);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !isValidObjectId(productId)) {
      return sendError(res, 400, "Valid productId is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendError(res, 404, "Cart not found");
    }

    const originalItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalItemCount) {
      return sendError(res, 404, "Product is not in cart");
    }

    cart.totalAmount = await calculateTotalAmount(cart.items);
    await cart.save();

    const populatedCart = await populateCart(cart);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeItem,
  clearCart,
};
