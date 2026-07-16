const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: [13, "Phone number must be exactly 13 characters"],
      maxlength: [13, "Phone number must be exactly 13 characters"],
      match: [/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    nic: {
      type: String,
      trim: true,
      maxlength: [12, "NIC cannot exceed 12 characters"],
      default: "",
      match: [/^(?:[0-9]{9}[VvXx]|[0-9]{12}|)$/, "Please enter a valid Sri Lankan NIC"],
    },
    logo: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

sellerSchema.index({ shopName: 1 });

module.exports = mongoose.model("Seller", sellerSchema);
