import { User } from "../models/user.model.js";

export async function handlePayouts(round) {
  for (const bet of round.bets) {
    if (bet.isDemo && bet.color === round.demoWinner) {
      await User.updateOne(
        { _id: bet.userId },
        { $inc: { demoBalance: bet.amount * 2 } }
      );
    }
    if (!bet.isDemo && bet.color === round.realWinner) {
      await User.updateOne(
        { _id: bet.userId },
        { $inc: { mainBalance: bet.amount * 2 } }
      );
    }
  }
}
