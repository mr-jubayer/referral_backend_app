import { startGameLoop } from "../../game/game.engine.js";
import { startGame, stopGame } from "../../game/game.state.js";

let ioInstance = null;

export const initializeGameLoop = (io) => {
  ioInstance = io;
  startGameLoop(ioInstance);
};

export const stopGameController = (req, res) => {
  stopGame();
  res.json({ message: "Game stopped" });
};

export const startGameController = (req, res) => {
  startGame();
  // Restart the loop if needed
  if (ioInstance) {
    startGameLoop(ioInstance);
  }
  res.json({ message: "Game started" });
};
