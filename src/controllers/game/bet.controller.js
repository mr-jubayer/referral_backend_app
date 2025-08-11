import { Round } from "../../models/round.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const placeBet = asyncHandler(async (req, res, next) => {
  const { color, amount, isDemo } = req.body;
  const userId = req.user._id;

  const currentRound = await Round.findOne({ status: "OPEN" }).sort({
    createdAt: -1,
  });

  if (!currentRound) throw new ApiError(400, "No active round right now");

  if (new Date(currentRound.endTime).getTime() - Date.now() <= 5000) {
    throw new ApiError(400, "Betting closed for this round");
  }

  currentRound.bets.push({ userId, amount, color, isDemo });
  await currentRound.save();

  res.json({ message: "Bet placed successfully" });
});
