import { Round } from "../../models/round.model.js";

export const getCurrentRound = async (req, res) => {
  const currentRound = await Round.findOne({ status: "OPEN" }).sort({
    createdAt: -1,
  });
  res.json(currentRound);
};

export const getRoundHistory = async (req, res) => {
  const history = await Round.find({ status: "RESULT" })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(history);
};
