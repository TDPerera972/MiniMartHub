const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize"); // Temporarily disabled
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const { protect } = require("./middleware/authMiddleware");

const validateEnvironment = () => {
  const requiredVariables = ["MONGO_URI", "JWT_SECRET"];
  const missingVariables = requiredVariables.filter(
    (key) => !process.env[key]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
};

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);

// ✅ Body Parser - MUST come before helmet
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ✅ Security Headers
app.use(helmet());

// ✅ Data Sanitization against NoSQL query injection
// Temporarily disabled due to Express 5 incompatibility
// (TypeError: Cannot set property query of #<IncomingMessage> which has only a getter)
/*
app.use(
  require("express-mongo-sanitize")({
    allowDots: true,
    replaceWith: "_",
  })
);
*/

// ✅ Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MiniMartHub Backend Running...",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/api/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Error handler with better logging
app.use((error, req, res, next) => {
  console.error("❌ Unhandled server error:", error);
  console.error("📋 Error stack:", error.stack);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    // Only show stack in development
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();