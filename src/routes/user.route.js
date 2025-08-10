import express from "express";
import { addEmail, addPhone } from "../controllers/user/add_email_or_phone.js";
import { loginUser } from "../controllers/user/login_user.js";
import { registerUser } from "../controllers/user/register_user.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addEmailValidation,
  addPhoneValidation,
  createUserValidation,
  loginUserValidation,
} from "../validations/user.validation.js";

const router = express.Router();

router.route("/register").post(createUserValidation, registerUser);
router.route("/login").post(loginUserValidation, loginUser);
router.route("/add-email").patch(verifyJWT, addEmailValidation, addEmail);
router.route("/add-phone").patch(verifyJWT, addPhoneValidation, addPhone);

export default router;
