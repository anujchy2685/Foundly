
import asyncHandler from "express-async-handler";

const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Please log in first");
  }

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }

  next();
});

export default adminMiddleware;