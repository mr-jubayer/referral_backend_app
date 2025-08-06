import express from "express";
import { createDeposit } from "../controllers/deposit/create_deposit.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUserValidation } from "../validations/deposit.validation.js";
const router = express.Router();

router.use(verifyJWT);
router.route("/").post(createUserValidation, createDeposit);

export default router;
