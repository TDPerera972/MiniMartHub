const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Seller = require("../models/Seller");

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      pendingSellers,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Seller.countDocuments({ status: "pending" }),
      Order.countDocuments({ orderStatus: "pending" }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        pendingSellers,
        pendingOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid user id");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["customer", "seller", "admin"];

    if (!role || !validRoles.includes(role)) {
      return sendError(res, 400, "Role must be one of: customer, seller, admin");
    }

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid user id");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid user id");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.role === "admin") {
      return sendError(res, 403, "Cannot delete an admin user");
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "seller",
      "name email phone"
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Admin Products Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Delete any product (admin)
// @route   DELETE /api/admin/products/:id
// @access  Admin
const deleteAdminProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid product id");
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Admin Product Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Admin
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Admin Orders Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
const updateAdminOrderStatus = async (req, res) => {
  try {
    const VALID_ORDER_STATUSES = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const { orderStatus } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid order id");
    }

    if (!orderStatus || !VALID_ORDER_STATUSES.includes(orderStatus)) {
      return sendError(res, 400, "Invalid order status");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendError(res, 404, "Order not found");
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Admin Order Status Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Get all sellers (admin view)
// @route   GET /api/admin/sellers
// @access  Admin
const getAdminSellers = async (req, res) => {
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
    console.error("Get Admin Sellers Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

// @desc    Update seller status (approve/reject/suspend)
// @route   PUT /api/admin/sellers/:id/status
// @access  Admin
const updateAdminSellerStatus = async (req, res) => {
  try {
    const VALID_STATUSES = ["pending", "approved", "rejected", "suspended"];
    const { status } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return sendError(res, 400, "Invalid seller id");
    }

    if (!status || !VALID_STATUSES.includes(status)) {
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
      await User.findByIdAndUpdate(
        seller.user,
        { role: "seller" },
        { runValidators: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Seller status updated successfully",
      seller,
    });
  } catch (error) {
    console.error("Update Admin Seller Status Error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

module.exports = {
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
};