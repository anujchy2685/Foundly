/** @format */

import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import { hash } from "bcrypt";

const createUser = asyncHandler(async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  userData.password = await hash(userData.password, 10);
  return await User.create(userData);
});

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture || "",
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// GET /user/me — current logged-in user (password/OTP never exposed)
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password -emailVerificationCode"
  );
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user: sanitizeUser(user) });
});

// POST /user/profile-picture — multipart form, field name: "profilePicture"
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Please choose an image to upload" });
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  user.profilePicture = `/uploads/${req.file.filename}`;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile photo updated",
    user: sanitizeUser(user),
  });
});

const create = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});
export { create, createUser, getMe, uploadProfilePicture };
