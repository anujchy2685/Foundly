import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const generateToken = asyncHandler(async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
});

export default generateToken;