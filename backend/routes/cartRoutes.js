const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  removeItem,
  clearCart,
} = require("../controllers/CartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove/:productId", protect, removeItem);
router.delete("/clear", protect, clearCart);

module.exports = router;
