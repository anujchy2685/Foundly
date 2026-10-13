import express from "express";
import {
  createFoundItem,
  getFoundItems,
  getFoundItem,
  getMyFoundItems,
} from "../controllers/foundItemController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getFoundItems);
router.get("/:id", getFoundItem);
router.get("/user/my-items", authMiddleware, getMyFoundItems);
router.post("/", authMiddleware, upload.array("images", 5), createFoundItem);

export default router;