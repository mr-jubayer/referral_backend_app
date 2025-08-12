import { startGameLoop } from "../../game/game.engine.js";
import { startGame, stopGame } from "../../game/game.state.js";

let ioInstance = null;
let connectedUsersInstance = null;

export const initializeGameLoop = (io, connectedUsers) => {
  ioInstance = io;
  connectedUsersInstance = connectedUsers;
  startGameLoop(ioInstance, connectedUsersInstance);
};

export const stopGameController = (req, res) => {
  stopGame();
  res.json({ message: "Game stopped" });
};

export const startGameController = (req, res) => {
  startGame();
  if (ioInstance && connectedUsersInstance) {
    startGameLoop(ioInstance, connectedUsersInstance);
  }
  res.json({ message: "Game started" });
};
