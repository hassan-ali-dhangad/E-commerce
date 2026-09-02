import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected admin operations
router.post(
  "/",
  authMiddleware,
  
  upload.single("image"),
  createCategory,
);

router.put(
  "/:id",
  authMiddleware,
  
  upload.single("image"),
  updateCategory,
);

router.delete("/:id", authMiddleware,  deleteCategory);

export default router;
