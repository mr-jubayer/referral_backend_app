import express from "express";
import { approveWithdraw } from "../controllers/withdraw/approve_withdraw.js";
import { withdrawRequest } from "../controllers/withdraw/withdraw_request.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  approveWithdrawValidation,
  withdrawRequestValidation,
} from "../validations/withdraw.validation.js";

const router = express.Router();

router.use(verifyJWT);
router.route("/request").post(withdrawRequestValidation, withdrawRequest);
router.route("/approve").post(approveWithdrawValidation, approveWithdraw);

export default router;

// Request work flow

// -> User Request for withdraw
// -> Passed Value : {amount, userId, method, status}
// -> User Input : { amount, method }

// -> Validate user, check on DB existence, zod validation
// -> Create withdraw request document and store it with "request" status
// -> Send confirmation response
