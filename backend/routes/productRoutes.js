const express = require("express");
const {
  addProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");
const { protect, authorize, requireActiveSeller } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get my products
router.get("/my-products", protect, authorize("seller", "admin"), getMyProducts);

// Get product by ID
router.get("/:id", getProductById);

// Add new product (Seller/Admin only)
router.post("/", protect, authorize("seller", "admin"), requireActiveSeller, addProduct);

// Update product (Seller/Admin only)
router.put("/:id", protect, authorize("seller", "admin"), requireActiveSeller, updateProduct);

// Delete product (Seller/Admin only)
router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);

module.exports = router;
