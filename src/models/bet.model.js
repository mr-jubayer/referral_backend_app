import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    roundId: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    team: { type: String, enum: ["red", "green"], required: true },
    type: { type: String, enum: ["demo", "real"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Bet", betSchema);
