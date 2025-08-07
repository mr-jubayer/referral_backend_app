import mongoose from "mongoose";
const withdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
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
  },
  {
    timestamps: true,
  }
);

export const Withdraw = mongoose.model("Withdraw", withdrawSchema);
