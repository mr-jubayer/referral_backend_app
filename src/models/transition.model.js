import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  type: {
    type: String,
    enum: ["referral", "deposit", "withdrawal", "bonus", "admin_add"],
    required: true,
  },

  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "success",
  },

  description: { type: String }, // optional detail, like "Referral from code JUB123"

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
