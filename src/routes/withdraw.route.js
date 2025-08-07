import express from "express";
import { withdrawRequest } from "../controllers/withdraw/withdraw_request";
import { withdrawRequestValidation } from "../validations/withdraw.validation";

const router = express.Router();

router.use(verifyJWT);
router.route("/request").post(withdrawRequestValidation, withdrawRequest);

export default router;

// Request work flow

// -> User Request for withdraw
// -> Passed Value : {amount, userId, method, status}
// -> User Input : { amount, method }

// -> Validate user, check on DB existence, zod validation
// -> Create withdraw request document and store it with "request" status
// -> Send confirmation response
