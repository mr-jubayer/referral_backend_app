import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    roundId: { type: Number, required: true, unique: true },
    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },
    winner: { type: String, enum: ["red", "green", null], default: null },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

export const Round = mongoose.model("Round", roundSchema);
