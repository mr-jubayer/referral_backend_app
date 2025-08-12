import { Bet } from "../models/bet.model.js";
import { Round } from "../models/round.model.js";
import { User } from "../models/user.model.js";
import {
  getDemoBalance,
  isGameRunning,
  updateDemoBalance,
} from "./game.state.js";

const MIN_PLAYERS = 3;
let roundCounter = 1;

let currentRoundTimeout;
let waitForPlayersInterval;

export async function startGameLoop(io, connectedUsers) {
  // Initialize roundCounter from DB
  const lastRound = await Round.findOne().sort({ roundId: -1 });
  roundCounter = lastRound ? lastRound.roundId + 1 : 1;

  async function runRound(roundId) {
    if (!isGameRunning()) {
      console.log("Game stopped, waiting to restart...");
      return;
    }

    io.emit("roundStart", { roundId });

    const bettingTime = 60 * 1000;
    const checkInterval = 2000;
    let elapsed = 0;

    waitForPlayersInterval = setInterval(async () => {
      if (!isGameRunning()) {
        clearInterval(waitForPlayersInterval);
        return;
      }

      // Count bets this round (for betting players)
      const playerBetCount = await Bet.countDocuments({ roundId });

      if (elapsed >= bettingTime - 5000) {
        clearInterval(waitForPlayersInterval);

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

              await Round.deleteOne({ roundId });

              await Bet.deleteMany({ roundId });
              startWaitingForPlayers();
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
                user.wallet.totalEarned += payout;
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

            startWaitingForPlayers();
          }, 5000);
        }, Math.max(0, bettingTime - elapsed - 5000));
      } else {
        elapsed += checkInterval;
        io.emit("waitingForPlayers", {
          roundId,
          currentPlayers: connectedUsers.size, // <-- Use connected users count here
          minPlayers: MIN_PLAYERS,
        });
      }
    }, checkInterval);
  }

  function startWaitingForPlayers() {
    if (!isGameRunning()) {
      console.log("Game stopped, not waiting for players.");
      return;
    }

    const roundId = roundCounter++;

    const waitInterval = setInterval(() => {
      if (!isGameRunning()) {
        clearInterval(waitInterval);
        return;
      }

      const currentConnected = connectedUsers.size;

      io.emit("waitingForPlayers", {
        roundId,
        currentPlayers: currentConnected,
        minPlayers: MIN_PLAYERS,
      });

      if (currentConnected >= MIN_PLAYERS) {
        clearInterval(waitInterval);

        Round.create({
          roundId,
          status: "open",
          startedAt: new Date(),
        }).then(() => {
          runRound(roundId);
        });
      }
    }, 2000);
  }

  startWaitingForPlayers();
}
