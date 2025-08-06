import express from "express";
import { referralLink } from "../controllers/referral_ink/referral_link.js";
const router = express.Router();

router.route("/:refId").get(referralLink);

export default router;
