import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  color: { type: String, enum: ["red", "green"] },
  isDemo: Boolean,
});

const roundSchema = new mongoose.Schema(
  {
    roundId: String,
    bets: [betSchema],
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "RESULT"],
      default: "OPEN",
    },
    realWinner: String,
    demoWinner: String,
    endTime: Date,
  },
  { timestamps: true }
);

export const Round = mongoose.model("Round", roundSchema);
