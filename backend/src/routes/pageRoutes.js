import express from "express";

import { getPages, getPageById } from "../controllers/pageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", authMiddleware, getPages);


router.get("/:id", authMiddleware, getPageById);

export default router;
