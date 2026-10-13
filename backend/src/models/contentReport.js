
import mongoose from "mongoose";

const contentReportSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "inappropriate",
        "suspicious",
        "duplicate",
        "incorrect",
        "other",
      ],
      required: true,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ContentReport", contentReportSchema);