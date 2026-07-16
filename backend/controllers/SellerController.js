const mongoose = require("mongoose");
const Seller = require("../models/Seller");
const User = require("../models/User");

const VALID_STATUSES = ["pending", "approved", "rejected", "suspended"];

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeSellerInput = (body) => ({
  shopName: String(body.shopName || "").trim(),
  ownerName: String(body.ownerName || "").trim(),
  email: normalizeEmail(body.email),
  phone: String(body.phone || "").trim(),
  address: String(body.address || "").trim(),
  category: String(body.category || "").trim(),
  nic: String(body.nic || "").trim(),
  logo: String(body.logo || "").trim(),
  description: String(body.description || "").trim(),
});

const validateSellerInput = (data, isCreate = true) => {
  const errors = [];
  const requiredFields = ["shopName", "ownerName", "email", "phone", "address", "category"];

  if (isCreate) {
    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    });
  }

  if (data.shopName && (data.shopName.length < 2 || data.shopName.length > 100)) {
    errors.push("shopName must be between 2 and 100 characters");
  }

  if (data.ownerName && (data.ownerName.length < 2 || data.ownerName.length > 80)) {
    errors.push("ownerName must be between 2 and 80 characters");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (data.phone && (data.phone.length < 7 || data.phone.length > 20)) {
    errors.push("phone must be between 7 and 20 characters");
  }

  if (data.address && data.address.length > 200) {
    errors.push("address cannot exceed 200 characters");
  }

  if (data.category && data.category.length > 80) {
    errors.push("category cannot exceed 80 characters");
  }

  if (data.description && data.description.length > 1000) {
    errors.push("description cannot exceed 1000 characters");
  }

  return errors;
};

const createSeller = async (req, res) => {
  try {
    const existingSeller = await Seller.findOne({ user: req.user._id });

    if (existingSeller) {
      return sendError(res, 409, "Seller profile already exists");
    }

    const sellerData = sanitizeSellerInput(req.body);
    const validationErrors = validateSellerInput(sellerData);

    if (validationErrors.length > 0) {
      return sendError(res, 400, "Validation failed", validationErrors);
    }

    const seller = await Seller.create({
      user: req.user._id,
      status: "approved",
      approvedAt: new Date(),
      ...sellerData,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { role: "seller" },
      { new: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: "Seller application submitted successfully",
      seller,
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, "Seller profile already exists");
    }

    console.error("Create Seller Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getApprovedSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ status: "approved" })
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    console.error("Get Approved Sellers Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getMySellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role"
    );

    if (!seller) {
      return sendError(res, 404, "Seller profile not found");
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Get My Seller Profile Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getSellerById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid seller id");
    }

    const query = { _id: req.params.id };

    if (!req.user || req.user.role !== "admin") {
      query.status = "approved";
    }

    const seller = await Seller.findOne(query).populate("user", "name email phone role");

    if (!seller) {
      return sendError(res, 404, "Seller profile not found");
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Get Seller By ID Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const updateMySellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      return sendError(res, 404, "Seller profile not found");
    }

    const sellerData = sanitizeSellerInput(req.body);
    const allowedFields = [
      "shopName",
      "ownerName",
      "email",
      "phone",
      "address",
      "category",
      "nic",
      "logo",
      "description",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (sellerData[field] !== "") {
        updates[field] = sellerData[field];
      }
    });

    const validationErrors = validateSellerInput(updates, false);

    if (validationErrors.length > 0) {
      return sendError(res, 400, "Validation failed", validationErrors);
    }

    Object.assign(seller, updates);
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller,
    });
  } catch (error) {
    console.error("Update Seller Profile Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sellers.length,
      sellers,
    });
  } catch (error) {
    console.error("Get All Sellers Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid seller id");
    }

    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 400, "Invalid seller status");
    }

    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return sendError(res, 404, "Seller profile not found");
    }

    seller.status = status;
    seller.approvedAt = status === "approved" ? new Date() : undefined;
    await seller.save();

    if (status === "approved") {
      await User.findByIdAndUpdate(seller.user, { role: "seller" }, { runValidators: true });
    }

    return res.status(200).json({
      success: true,
      message: "Seller status updated successfully",
      seller,
    });
  } catch (error) {
    console.error("Update Seller Status Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Total Products
    const Product = require("../models/Product");
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // 2. Aggregate Orders
    const Order = require("../models/Order");
    const orders = await Order.find({ "items.seller": sellerId });

    let totalOrders = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let totalRevenue = 0;

    // A single checkout order might contain items from multiple sellers.
    // We only count revenue/items matching the current seller.
    orders.forEach((order) => {
      let isSellerInvolved = false;
      let orderRevenueForSeller = 0;

      order.items.forEach((item) => {
        if (item.seller.toString() === sellerId.toString()) {
          isSellerInvolved = true;
          // Calculate revenue ONLY from delivered orders
          if (order.orderStatus === "delivered") {
            orderRevenueForSeller += item.price * item.quantity;
          }
        }
      });

      if (isSellerInvolved) {
        totalOrders++;
        if (order.orderStatus === "pending") pendingOrders++;
        if (order.orderStatus === "delivered") {
          deliveredOrders++;
          totalRevenue += orderRevenueForSeller;
        }
      }
    });

    return res.status(200).json({
      success: true,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders
    });
  } catch (error) {
    console.error("Get Seller Dashboard Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
  createSeller,
  getApprovedSellers,
  getMySellerProfile,
  getSellerById,
  updateMySellerProfile,
  getAllSellers,
  updateSellerStatus,
  getSellerDashboard,
};
