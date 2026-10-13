import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    lostLocation: {
      type: String,
      required: true,
    },

    lostDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "CLAIM_REQUESTED",
        "CLAIM_ACCEPTED",
        "RETURN_PENDING",
        "RETURNED",
        "CLOSED",
      ],
      default: "ACTIVE",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LostItem", lostItemSchema);
