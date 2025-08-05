import express from "express";
import { loginUser } from "../controllers/user/login_user.js";
import { registerUser } from "../controllers/user/register_user.js";
import { createUserValidation } from "../validations/user.validation.js";

const router = express.Router();

router.route("/register").post(createUserValidation, registerUser);
router.route("/login").post(loginUser);

export default router;
