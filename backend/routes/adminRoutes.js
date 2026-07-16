const express = require("express");
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAdminProducts,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminSellers,
  updateAdminSellerStatus,
} = require("../controllers/AdminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Products
router.get("/products", getAdminProducts);
router.delete("/products/:id", deleteAdminProduct);

// Orders
router.get("/orders", getAdminOrders);
router.put("/orders/:id/status", updateAdminOrderStatus);

// Sellers
router.get("/sellers", getAdminSellers);
router.put("/sellers/:id/status", updateAdminSellerStatus);

module.exports = router;