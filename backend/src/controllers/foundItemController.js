import FoundItem from "../models/foundItem.js";
import asyncHandler from "express-async-handler";

// A found date can only be today or in the past — never in the future.
const isFutureDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const given = new Date(date);
  given.setHours(0, 0, 0, 0);
  return given.getTime() > today.getTime();
};

// CREATE FOUND ITEM
export const createFoundItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    foundLocation,
    foundDate,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !foundLocation ||
    !foundDate
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all required fields" });
  }

  if (isFutureDate(foundDate)) {
    return res.status(400).json({
      success: false,
      message: "Found date cannot be in the future",
    });
  }

  const images = req.files
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : [];

  const foundItem = await FoundItem.create({
    title,
    description,
    category,
    foundLocation,
    foundDate,
    images,
    reportedBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Found item report created successfully",
    item: foundItem,
  });
});


// GET ALL FOUND ITEMS — supports ?search=&category=&location=&status=&page=&limit=
export const getFoundItems = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    location,
    status,
    page,
    limit,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.foundLocation = {
      $regex: location,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const total = await FoundItem.countDocuments(filter);

  let query = FoundItem.find(filter)
    .populate("reportedBy", "name email profilePicture")
    .sort({ createdAt: -1 });

  // Paginate only when the client asks for it — otherwise return everything
  // so existing clients keep working.
  if (page !== undefined || limit !== undefined) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 9)
    );
    query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    const items = await query;
    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      items,
    });
  }

  const items = await query;

  return res.status(200).json({
    success: true,
    count: items.length,
    total,
    items,
  });
});


// GET SINGLE FOUND ITEM
export const getFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id)
    .populate("reportedBy", "name email profilePicture");

  if (!item) {
    return res
      .status(404)
      .json({ success: false, message: "Found item not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Found item retrieved successfully",
    item,
  });
});



// GET MY FOUND ITEMS
export const getMyFoundItems = asyncHandler(async (req, res) => {
  const items = await FoundItem.find({
    reportedBy: req.user._id,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: items.length,
    items,
  });
});
