import express from "express";

import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  resendOTP,
  changePassword,
  getMe,
  logout,
  deleteAccount,

  // USER MANAGEMENT
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { getPages } from "../controllers/productController.js";

const router = express.Router();

// =====================================================
// AUTH
// =====================================================

router.post("/signup", signup);

router.post("/verify-email", verifyEmail);

router.post("/resend-otp", resendOTP);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/change-password", authMiddleware, changePassword);

router.get("/me", authMiddleware, getMe);

router.post("/logout", logout);

router.delete("/delete-account", authMiddleware, deleteAccount);


router.get("/users", authMiddleware, getUsers);

router.get("/users/:id", authMiddleware, getUserById);

router.put("/users/:id", authMiddleware, updateUser);

router.delete("/users/:id", authMiddleware, deleteUser);
router.get("/pages", authMiddleware, getPages);
export default router;
