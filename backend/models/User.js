const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [5, "Email must be at least 5 characters"],
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      minlength: [13, "Phone number must be exactly 13 characters"],
      maxlength: [13, "Phone number must be exactly 13 characters"],
      match: [/^\+94\d{9}$/, "Please enter a valid Sri Lankan phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    image: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User;
