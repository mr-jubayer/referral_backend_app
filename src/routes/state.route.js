import express from "express";
import { getStates } from "../controllers/states/states.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getStates);

export default router;
