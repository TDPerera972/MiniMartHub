const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

const sendAuthError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendAuthError(res, 401, "Authentication required");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from the environment");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendAuthError(res, 401, "Invalid or expired token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendAuthError(res, 401, "Token has expired");
    }

    if (error.name === "JsonWebTokenError") {
      return sendAuthError(res, 401, "Invalid token");
    }

    console.error("Authentication middleware error:", error);
    return sendAuthError(res, 401, "Authentication failed");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, 401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return sendAuthError(res, 403, "Access denied");
    }

    next();
  };
};

const requireActiveSeller = async (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    try {
      const seller = await Seller.findOne({ user: req.user._id });
      if (seller && (seller.status === "rejected" || seller.status === "suspended")) {
        return sendAuthError(res, 403, "Your seller account has been suspended or rejected.");
      }
    } catch (err) {
      return sendAuthError(res, 500, "Internal server error");
    }
  }
  next();
};

module.exports = {
  protect,
  authorize,
  requireActiveSeller,
};
