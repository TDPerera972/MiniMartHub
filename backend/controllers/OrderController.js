const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const VALID_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateShippingAddress = (shippingAddress) => {
  const errors = [];

  if (!shippingAddress || typeof shippingAddress !== "object") {
    return ["Shipping address is required"];
  }

  const requiredFields = ["fullName", "phone", "addressLine1", "city"];

  requiredFields.forEach((field) => {
    if (!String(shippingAddress[field] || "").trim()) {
      errors.push(`${field} is required`);
    }
  });

  return errors;
};

const buildOrderItems = async (items) => {
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  return items.map((item) => {
    const product = productMap.get(item.product);
    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Each order item must have a quantity of at least 1");
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    return {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      seller: product.seller,
    };
  });
};

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const validationErrors = [];

    if (!Array.isArray(items) || items.length === 0) {
      validationErrors.push("Order items are required");
    }

    if (Array.isArray(items)) {
      items.forEach((item, index) => {
        if (!item.product || !isValidObjectId(item.product)) {
          validationErrors.push(`items[${index}].product must be a valid product id`);
        }
      });
    }

    validationErrors.push(...validateShippingAddress(shippingAddress));

    if (validationErrors.length > 0) {
      return sendError(res, 400, "Validation failed", validationErrors);
    }

    const orderItems = await buildOrderItems(items);
    const itemsPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingPrice = Number(req.body.shippingPrice || 0);
    const taxPrice = Number(req.body.taxPrice || 0);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: String(shippingAddress.fullName || "").trim(),
        phone: String(shippingAddress.phone || "").trim(),
        addressLine1: String(shippingAddress.addressLine1 || "").trim(),
        addressLine2: String(shippingAddress.addressLine2 || "").trim(),
        city: String(shippingAddress.city || "").trim(),
        postalCode: String(shippingAddress.postalCode || "").trim(),
        country: String(shippingAddress.country || "Sri Lanka").trim(),
      },
      paymentMethod: paymentMethod || "cash_on_delivery",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const stockUpdates = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const bulkResult = await Product.bulkWrite(stockUpdates);

    const anyFailed = bulkResult.modifiedCount !== orderItems.length;

    if (anyFailed) {
      await Order.findByIdAndDelete(order._id);

      const rollbackUpdates = orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: item.quantity } },
        },
      }));

      await Product.bulkWrite(rollbackUpdates);

      return sendError(res, 400, "Insufficient stock for one or more products");
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return sendError(res, 400, error.message || "Unable to create order");
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getOrderById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid order id");
    }

    const order = await Order.findById(req.params.id).populate("user", "name email phone");

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isSellerOwner = req.user.role === "seller" && order.items.some(item => item.seller?.toString() === req.user._id.toString());

    if (!isOwner && !isAdmin && !isSellerOwner) {
      return sendError(res, 403, "Access denied");
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid order id");
    }

    if (!VALID_ORDER_STATUSES.includes(orderStatus)) {
      return sendError(res, 400, "Invalid order status");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    if (req.user.role === "seller" && !order.items.some(item => item.seller?.toString() === req.user._id.toString())) {
      return sendError(res, 403, "Access denied: You do not have products in this order");
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
};
