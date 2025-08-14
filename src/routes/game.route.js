import express from "express";
import {
  startGameController,
  stopGameController,
} from "../controllers/game/admin_game_control.js";
import { placeBet } from "../controllers/game/bet.controller.js";
import { getBetHistory } from "../controllers/game/getBetHistory.js";
import { getRoundHistory } from "../controllers/game/round.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { betValidation } from "../validations/game.validation.js";

const router = express.Router();

router.use(verifyJWT);
// api/v1/bet
router.route("/bet").post(betValidation, placeBet);
router.route("/bets").get(getBetHistory);
// router.route("/round-history").get(getBetHistory);
// router.route("/round").get(getCurrentRound);
router.route("/rounds").get(getRoundHistory);
router.route("/start").get(startGameController);
router.route("/stop").get(stopGameController);

export default router;

// Start a round every 60 seconds.
// Close betting at the last 5 seconds.
// Decide winners when the round ends.
// Store results in MongoDB.
