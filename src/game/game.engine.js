import Bet from "../models/bet.model.js";
import { Round } from "../models/round.model.js";
import { User } from "../models/user.model.js";
import {
  getDemoBalance,
  isGameRunning,
  updateDemoBalance,
} from "./game.state.js";

let roundCounter = 1;
const MIN_PLAYERS = 3;

let currentRoundTimeout;
let waitForPlayersInterval;

export function startGameLoop(io) {
  async function runRound() {
    if (!isGameRunning()) {
      console.log("Game stopped, waiting to restart...");
      return;
    }

    const roundId = roundCounter++;
    await Round.create({
      roundId,
      status: "open",
      startedAt: new Date(),
    });

    io.emit("roundStart", { roundId });

    const bettingTime = 60 * 1000; // 1 minute total
    const checkInterval = 2000; // 2 seconds check
    let elapsed = 0;

    waitForPlayersInterval = setInterval(async () => {
      if (!isGameRunning()) {
        clearInterval(waitForPlayersInterval);
        return;
      }
      const playerCount = await Bet.countDocuments({ roundId });

      if (playerCount >= MIN_PLAYERS || elapsed >= bettingTime - 5000) {
        clearInterval(waitForPlayersInterval);

        // Close betting 5 seconds before end
        currentRoundTimeout = setTimeout(async () => {
          if (!isGameRunning()) return;
          await Round.updateOne({ roundId }, { status: "closed" });
          io.emit("bettingClosed", { roundId });

          setTimeout(async () => {
            if (!isGameRunning()) return;

            const bets = await Bet.find({ roundId });
            if (bets.length < MIN_PLAYERS) {
              io.emit("roundCancelled", {
                roundId,
                reason: "Not enough players",
              });
              await Round.updateOne(
                { roundId },
                { status: "cancelled", endedAt: new Date() }
              );
              await Bet.deleteMany({ roundId });
              runRound();
              return;
            }

            const redCount = bets.filter((b) => b.team === "red").length;
            const greenCount = bets.filter((b) => b.team === "green").length;

            let winner;
            if (bets.some((b) => b.type === "demo")) {
              winner =
                Math.random() < 0.8
                  ? redCount <= greenCount
                    ? "red"
                    : "green"
                  : redCount > greenCount
                  ? "red"
                  : "green";
            } else {
              winner = redCount <= greenCount ? "red" : "green";
            }

            await Round.updateOne(
              { roundId },
              { status: "completed", winner, endedAt: new Date() }
            );

            const winningBets = bets.filter((b) => b.team === winner);

            for (const bet of winningBets) {
              const payout = bet.amount * 2;
              const user = await User.findById(bet.userId);

              if (bet.type === "real") {
                user.wallet.mainBalance += payout;
                user.wallet.totalEarned += payout; // Track earnings
                await user.save();
              } else {
                const demoBal = getDemoBalance(user._id.toString());
                updateDemoBalance(user._id.toString(), demoBal + payout);
              }
            }

            io.emit("roundResult", {
              roundId,
              winner,
              payouts: winningBets.map((b) => ({
                userId: b.userId,
                amount: b.amount * 2,
              })),
            });

            await Bet.deleteMany({ roundId });

            runRound();
          }, 5000);
        }, Math.max(0, bettingTime - elapsed - 5000));
      } else {
        elapsed += checkInterval;
        io.emit("waitingForPlayers", {
          roundId,
          currentPlayers: playerCount,
          minPlayers: MIN_PLAYERS,
        });
      }
    }, checkInterval);
  }

  runRound();
}
