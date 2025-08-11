import { startGame, stopGame } from "../../game/game.state.js";

export const stopGameController = (req, res) => {
  stopGame();
  res.json({ message: "Game stopped" });
};

export const startGameController = (req, res) => {
  startGame();
  res.json({ message: "Game started" });
};
