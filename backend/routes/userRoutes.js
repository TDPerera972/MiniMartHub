const express = require("express");
const { updateProfile } = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/profile", protect, updateProfile);

module.exports = router;
