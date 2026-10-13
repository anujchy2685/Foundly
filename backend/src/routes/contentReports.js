import { Router } from "express";

import {createContentReport} from "../controllers/adminController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createContentReport);

export default router;