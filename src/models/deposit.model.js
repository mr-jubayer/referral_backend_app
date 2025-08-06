import mongoose from "mongoose";
const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "declined", "approved"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["bkash", "nagod"],
      required: true,
      default: "bkash",
    },
    transitionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Deposit = mongoose.model("Deposit", depositSchema);
