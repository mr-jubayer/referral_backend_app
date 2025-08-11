import { getDemoBalance, updateDemoBalance } from "../../game/game.state.js";
import Bet from "../../models/bet.model.js";
import { User } from "../../models/user.model.js";

export const placeBet = async (req, res) => {
  try {
    const { roundId, team, amount } = req.body;
    const user = await User.findById(req.user._id);

    let betType = "real";

    if (user.wallet.mainBalance <= 0) {
      // use demo balance
      const demoBalance = getDemoBalance(user._id.toString());
      if (demoBalance < amount) {
        return res.status(400).json({ error: "Not enough demo balance" });
      }
      updateDemoBalance(user._id.toString(), demoBalance - amount);
      betType = "demo";
    } else {
      // real balance
      if (user.wallet.mainBalance < amount) {
        return res.status(400).json({ error: "Not enough real balance" });
      }
      user.wallet.mainBalance -= amount;
      await user.save();
    }

    await Bet.create({
      roundId,
      userId: user._id,
      team,
      amount,
      type: betType,
    });

    res.json({ message: "Bet placed", type: betType });
  } catch (err) {
    console.error("Place bet error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
