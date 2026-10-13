import express from "express";
import {
  createLostItem,
  getLostItems,
  getLostItem,
  getMyLostItems,
} from "../controllers/lostItemController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getLostItems);
router.get("/:id", getLostItem);
router.get("/user/my-items", authMiddleware, getMyLostItems);
router.post("/", authMiddleware, upload.array("images", 5), createLostItem);

export default router;