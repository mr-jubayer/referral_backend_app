import express from "express";
import { placeBet } from "../controllers/game/bet.controller.js";
import {
  getCurrentRound,
  getRoundHistory,
} from "../controllers/game/round.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/bet").post(placeBet);
router.route("/round").get(getCurrentRound);
router.route("/history").get(getRoundHistory);

export default router;

// Start a round every 60 seconds.
// Close betting at the last 5 seconds.
// Decide winners when the round ends.
// Store results in MongoDB.
