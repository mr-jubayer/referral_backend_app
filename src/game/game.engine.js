// src/game/game.engine.js
import { isGameRunning } from "./game.state.js";

export function startGameLoop(io) {
  console.log("Game loop starting...");

  let roundNumber = 1;

  const runRound = () => {
    if (!isGameRunning()) {
      console.log("Game stopped by admin.");
      return; // Exit without scheduling next round
    }

    const roundId = roundNumber++;
    console.log(`Round ${roundId} started`);

    io.emit("roundStart", { roundId, message: "New round started" });

    // Betting phase: 55 seconds open
    setTimeout(() => {
      io.emit("bettingClosed", { roundId });
      console.log(`Round ${roundId} betting closed`);

      // Simulate result after 5 seconds
      setTimeout(() => {
        const winner = Math.random() > 0.5 ? "red" : "green";
        io.emit("roundResult", { roundId, winner });
        console.log(`Round ${roundId} winner: ${winner}`);

        // Schedule next round automatically
        runRound();
      }, 5000);
    }, 55000);
  };

  runRound();
}
