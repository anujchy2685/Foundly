import { Router } from "express";
import { create, getMe, uploadProfilePicture } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/create", create);

// Everything below requires a logged-in user
router.use(authMiddleware);

router.get("/me", getMe);
router.post(
  "/profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);

export default router;
