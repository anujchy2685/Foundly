import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
  resendOtp,
} from "../controllers/authContoller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

// Public routes — no login required
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);

// Protected routes go below this line
authRouter.use(authMiddleware);

export default authRouter;