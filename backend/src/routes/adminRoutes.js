
import { Router } from "express";
import {
  getAdminOverview,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllItems,
  updateItem,
  deleteItem,
  getContentReports,
  reviewContentReport,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

// Every endpoint below requires login AND admin role.
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/overview", getAdminOverview);

router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/items", getAllItems);
router.patch("/items/:itemType/:id", updateItem);
router.delete("/items/:itemType/:id", deleteItem);

router.get("/reports", getContentReports);
router.patch("/reports/:id/review", reviewContentReport);

export default router;