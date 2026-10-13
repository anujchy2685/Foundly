/** @format */

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const publicPaths = [
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-otp",
];

export const authMiddleware = asyncHandler(async (req, res, next) => {
  if (publicPaths.includes(req.path)) {
    return next();
  }
  
  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (!token || type !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    throw error;
  }

  const userId = decoded.userId || decoded.id;
  req.user = { ...decoded, _id: userId, userId };
  next();
});
