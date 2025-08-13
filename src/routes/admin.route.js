import express from "express";
import {
  startGameController,
  stopGameController,
} from "../controllers/game/admin_game_control.js";

const router = express.Router();

router.route("/game/stop").post(stopGameController);
router.route("/game/start").post(startGameController);

export default router;
