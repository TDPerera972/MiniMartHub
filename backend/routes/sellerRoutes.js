const express = require("express");
const {
  createSeller,
  getApprovedSellers,
  getMySellerProfile,
  getSellerById,
  updateMySellerProfile,
  getAllSellers,
  updateSellerStatus,
  getSellerDashboard,
} = require("../controllers/SellerController");
const { protect, authorize, requireActiveSeller } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getApprovedSellers);
router.get("/dashboard", protect, authorize("seller", "admin"), requireActiveSeller, getSellerDashboard);
router.post("/apply", protect, createSeller);
router.get("/me", protect, getMySellerProfile);
router.put("/me", protect, updateMySellerProfile);
router.get("/admin/all", protect, authorize("admin"), getAllSellers);
router.put("/admin/:id/status", protect, authorize("admin"), updateSellerStatus);
router.get("/:id", getSellerById);

module.exports = router;
