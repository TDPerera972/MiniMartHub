const express = require("express");
const { registerUser, loginUser, adminLogin } = require("../controllers/AuthController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin-login").post(adminLogin);

module.exports = router;
