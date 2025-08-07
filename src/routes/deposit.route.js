import express from "express";
import { approveDeposit } from "../controllers/deposit/approve_deposit.js";
import { depositRequest } from "../controllers/deposit/deposit_request.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  approveDepositValidation,
  depositRequestValidation,
} from "../validations/deposit.validation.js";
const router = express.Router();

router.use(verifyJWT);
router.route("/request").post(depositRequestValidation, depositRequest);
router.route("/approve").post(approveDepositValidation, approveDeposit);

export default router;
