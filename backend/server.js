import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// 1. Load environment variables first
dotenv.config();

// 2. Bypass SSL certificate validation locally if needed
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// 3. Import routes and database config after dotenv
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import pageRoutes from "./src/routes/pageRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

// Base Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopSphere API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/products", productRoutes);
app.use("/api/roles", roleRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
