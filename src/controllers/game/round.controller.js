import { Round } from "../../models/round.model.js";

export const getCurrentRound = async (req, res) => {
  try {
    const currentRound = await Round.findOne({ status: "open" }).sort({
      createdAt: -1,
    });
    res.json(currentRound);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getRoundHistory = async (req, res) => {
  try {
    const history = await Round.find({ status: "completed" })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
