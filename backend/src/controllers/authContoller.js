
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import sendMail from "../utils/mailService.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture || "",
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
});

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    // Let users with a pending (unverified) account continue verification
    // instead of getting stuck.
    if (!existingUser.isEmailVerified) {
      const otp = generateOtp();
      existingUser.emailVerificationCode = hashOtp(otp);
      existingUser.emailVerificationExpires = new Date(
        Date.now() + 10 * 60 * 1000
      );
      await existingUser.save();
      try {
        await sendMail(
          existingUser.email,
          "Your new Foundly verification code",
          `Hello ${existingUser.name},\n\nYour new verification code is: ${otp}\n\nThis code expires in 10 minutes.`
        );
      } catch (error) {
        console.error("Resend email failed:", error.message);
      }
      return res.status(409).json({
        success: false,
        message: "Email is registered but not verified. A new code was sent.",
        email: existingUser.email,
      });
    }
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOtp();

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
    isEmailVerified: false,
    emailVerificationCode: hashOtp(otp),
    emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendMail(
      user.email,
      "Verify your Foundly account",
      `Hello ${user.name},\n\nYour Foundly verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, you can ignore this email.`
    );
  } catch (error) {
    // Keep the account pending so the user can request a new OTP.
    console.error("Verification email failed:", error.message);

    return res.status(502).json({
      success: false,
      message:
        "Account created, but the verification email could not be sent. Please request a new OTP.",
      email: user.email,
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email for the verification code.",
    email: user.email,
  });
});

// VERIFY EMAIL
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  if (!/^\d{6}$/.test(String(otp))) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid six-digit code",
    });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Account not found" });
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: "Email is already verified. Please log in.",
    });
  }

  if (
    !user.emailVerificationCode ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires.getTime() <= Date.now()
  ) {
    return res.status(400).json({
      success: false,
      message: "Verification code has expired. Please request a new one.",
    });
  }

  const submittedHash = hashOtp(String(otp));

  if (submittedHash !== user.emailVerificationCode) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect verification code" });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = null;
  user.emailVerificationExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

// RESEND OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Account not found" });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: "Email is already verified. Please log in.",
    });
  }

  const otp = generateOtp();

  user.emailVerificationCode = hashOtp(otp);
  user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  try {
    await sendMail(
      user.email,
      "Your new Foundly verification code",
      `Hello ${user.name},\n\nYour new verification code is: ${otp}\n\nThis code expires in 10 minutes.`
    );
  } catch (error) {
    // Invalidate the code because the email was not sent.
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    console.error("Resend email failed:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to send verification email. Please try again later.",
    });
  }

  res.status(200).json({
    success: true,
    message: "A new verification code has been sent to your email.",
  });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in",
    });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ success: false, message: "Your account is inactive" });
  }

  const token = signToken(user);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: sanitizeUser(user),
  });
});
