const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
} = require("../controllers/OrderController");
const { protect, authorize, requireActiveSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/seller", protect, authorize("seller", "admin"), requireActiveSeller, getSellerOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin", "seller"), requireActiveSeller, updateOrderStatus);

module.exports = router;
