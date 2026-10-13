// src/middleware/errorHandler.js

import ApiError from "../utils/apiError.js";

// Runs when no route matches
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

// Global error handler — must have 4 parameters
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert normal errors into ApiError instances
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (res.statusCode >= 400
        ? res.statusCode
        : error.name === "MulterError"
          ? 400
          : 500);
    const message =
      error.name === "MulterError" && error.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 5MB or smaller"
        : error.message || "Internal Server Error";

    error = new ApiError(statusCode, message, error.errors || []);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  };

  return res.status(error.statusCode).json(response);
};