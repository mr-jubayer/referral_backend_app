import express from "express";
import { getReferTree } from "../controllers/refer/get_refer_tree.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getReferTree);

export default router;

// Start a round every 60 seconds.
// Close betting at the last 5 seconds.
// Decide winners when the round ends.
// Store results in MongoDB.
