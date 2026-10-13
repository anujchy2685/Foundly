
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import LostItem from "../models/lostItem.js";
import FoundItem from "../models/foundItem.js";
import ContentReport from "../models/contentReport.js";

// GET DASHBOARD STATISTICS
export const getAdminOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalLostItems,
    totalFoundItems,
    pendingReports,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    LostItem.countDocuments(),
    FoundItem.countDocuments(),
    ContentReport.countDocuments({ status: "pending" }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalLostItems,
      totalFoundItems,
      totalItems: totalLostItems + totalFoundItems,
      pendingReports,
    },
  });
});

// GET ALL USERS
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -emailVerificationCode -emailVerificationExpires")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: users });
});

// ACTIVATE / DEACTIVATE A USER
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be deactivated here");
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
    data: { id: user._id, isActive: user.isActive },
  });
});

// DELETE A USER
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be deleted here");
  }

  await user.deleteOne();

  res.json({ success: true, message: "User deleted successfully" });
});

// GET ALL LOST AND FOUND ITEMS
export const getAllItems = asyncHandler(async (req, res) => {
  const [lostItems, foundItems] = await Promise.all([
    LostItem.find().populate("reportedBy", "name email").lean(),
    FoundItem.find().populate("reportedBy", "name email").lean(),
  ]);

  const items = [
    ...lostItems.map((item) => ({ ...item, itemType: "lost" })),
    ...foundItems.map((item) => ({ ...item, itemType: "found" })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  res.json({ success: true, data: items });
});

// EDIT AN ITEM REPORT
export const updateItem = asyncHandler(async (req, res) => {
  const { itemType } = req.params;
  const Model =
    itemType === "lost"
      ? LostItem
      : itemType === "found"
        ? FoundItem
        : null;

  if (!Model) {
    res.status(400);
    throw new Error("Item type must be lost or found");
  }

  const allowedFields =
    itemType === "lost"
      ? ["title", "description", "category", "lostLocation", "lostDate"]
      : ["title", "description", "category", "foundLocation", "foundDate"];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("No valid item fields supplied");
  }

  const item = await Model.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.json({
    success: true,
    message: "Item report updated successfully",
    data: item,
  });
});

// DELETE AN ITEM REPORT
export const deleteItem = asyncHandler(async (req, res) => {
  const { itemType } = req.params;
  const Model =
    itemType === "lost"
      ? LostItem
      : itemType === "found"
        ? FoundItem
        : null;

  if (!Model) {
    return new ApiResponse(res, 400, "Item type must be lost or found");
  }

  const item = await Model.findByIdAndDelete(req.params.id);

  if (!item) {
    return new ApiResponse(res, 404, "Item not found");
  }

  // Remove moderation reports associated with this item.
  await ContentReport.deleteMany({
    itemType,
    itemId: item._id,
  });

  return new ApiResponse(res, 200, "Item report deleted successfully");
});


export const createContentReport = asyncHandler(async (req, res) => {
  const { itemType, itemId, reason, details = "" } = req.body;

  if (!["lost", "found"].includes(itemType)) {
    return new ApiResponse(res, 400, "Invalid item type");
  }

  const Model = itemType === "lost" ? LostItem : FoundItem;
  const item = await Model.findById(itemId);

  if (!item) {
    return new ApiResponse(res, 404, "Item not found");
  }

  if (String(item.reportedBy) === String(req.user._id)) {
    return new ApiResponse(res, 403, "You cannot report your own item");
  }

  const report = await ContentReport.create({
    itemType,
    itemId,
    reportedBy: req.user._id,
    reason,
    details,
  });

  return new ApiResponse(res, 201, "Content report submitted successfully", report);
});

// VIEW CONTENT REPORTS
export const getContentReports = asyncHandler(async (req, res) => {
  const reports = await ContentReport.find()
    .populate("reportedBy", "name email")
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const results = await Promise.all(
    reports.map(async (report) => {
      const Model =
        report.itemType === "lost" ? LostItem : FoundItem;

      const item = await Model.findById(report.itemId).lean();

      return { ...report, item };
    })
  );

  res.json({ success: true, data: results });
});

// REVIEW OR DISMISS A CONTENT REPORT
export const reviewContentReport = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["reviewed", "dismissed"].includes(status)) {
    return new ApiResponse(res, 400, "Status must be reviewed or dismissed");
  }

  const report = await ContentReport.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewedBy: req.user._id,
    },
    { new: true, runValidators: true }
  );

  if (!report) {
    return new ApiResponse(res, 404, "Content report not found");
  }

  return new ApiResponse(res, 200, "Content report reviewed successfully", report);
});