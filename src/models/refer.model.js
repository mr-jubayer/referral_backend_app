import mongoose, { Schema } from "mongoose";

const referSchema = new Schema(
  {
    referredBy: {
      type: String,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bonusAmount: {
      type: Number,
      default: 0,
    },
    isBonusGiven: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Refer = mongoose.model("Refer", referSchema);
