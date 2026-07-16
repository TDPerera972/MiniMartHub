const Product = require("../models/Product");

// @desc    Add Product
// @route   POST /api/products
// @access  Seller/Admin (later)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, seller } = req.body;

    if (!name || !description || !price || !category || !stock || !image || !seller) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      seller: req.user._id, // Override seller with authenticated user ID
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Get All Products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "seller",
      "name email phone image rating"
    );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Get Seller's Products
// @route   GET /api/products/my-products
// @access  Seller
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get My Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Get Product By ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email phone image rating"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Seller/Admin
const updateProduct = async (req, res) => {
  try {
    const allowedFields = ["name", "description", "price", "category", "stock", "image"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not own this product",
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Seller/Admin (later)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not own this product",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};