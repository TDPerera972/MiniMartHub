const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+94\d{9}$/;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

const validateRegisterInput = ({ name, email, phone, password }) => {
  const errors = [];
  const trimmedName = String(name || "").trim();
  const normalizedEmail = normalizeEmail(email);
  const trimmedPhone = String(phone || "").trim();
  const userPassword = String(password || "");

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    errors.push("Name must be between 2 and 80 characters");
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.push("Valid email is required");
  }

  if (!PHONE_REGEX.test(trimmedPhone)) {
    errors.push("Valid phone number is required");
  }

  if (userPassword.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return errors;
};

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the environment");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");
    const validationErrors = validateRegisterInput({ name, email, phone, password });

    if (validationErrors.length > 0) {
      return sendError(res, 400, "Validation failed", validationErrors);
    }

    const userExists = await User.exists({ email });

    if (userExists) {
      return sendError(res, 409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, "Email is already registered");
    }

    console.error("Register error:", error);
    return sendError(res, 500, "Internal server error");
  }
};

const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    if (!EMAIL_REGEX.test(email)) {
      return sendError(res, 400, "Valid email is required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Internal server error");
  }
};
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== "minimartadmin" || password !== "@admin2026") {
      return sendError(res, 401, "Invalid admin credentials");
    }

    const admin = await User.findOne({
      email: "admin@minimarthub.com",
      role: "admin"
    });

    if (!admin) {
      return sendError(res, 404, "Admin account not found in the database. Please create it first.");
    }

    const token = createToken(admin);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: sanitizeUser(admin),
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return sendError(res, 500, "Internal server error");
  }
};
module.exports = {
  registerUser,
  loginUser,
  adminLogin,
};
