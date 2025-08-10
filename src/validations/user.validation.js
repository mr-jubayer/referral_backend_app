import { z } from "zod";

const validatePhoneNumber = /^(?:(?:\+|00)88|01)?\d{11}$/;

const createUserValidationSchema = z.object({
  username: z.string({ message: "username is required" }),
  phone: z
    .string({ message: "Phone is required" })
    .regex(
      validatePhoneNumber,
      "Invalid phone number format. Expected formats: 01xxxxxxxxx, +8801xxxxxxxxx, or 8801xxxxxxxxx."
    ),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  email: z.string({ message: "User email is required." }).email(),
  referredBy: z.string().optional(),
});

const loginUserValidationSchema = z.object({
  phone: z
    .string({ message: "Phone is required" })
    .regex(
      validatePhoneNumber,
      "Invalid phone number format. Expected formats: 01xxxxxxxxx, +8801xxxxxxxxx, or 8801xxxxxxxxx."
    )
    .optional(),
  email: z.string({ message: "User email is required." }).email().optional(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

const createUserValidation = async (req, res, next) => {
  try {
    req.body = createUserValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = createUserValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};
const loginUserValidation = async (req, res, next) => {
  try {
    req.body = loginUserValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = loginUserValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

const addEmailValidation = async (req, res, next) => {
  try {
    req.body = addEmailSchema.parse(req.body);
    next();
  } catch (error) {
    const result = addEmailSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};
const addPhoneValidation = async (req, res, next) => {
  try {
    req.body = addPhoneSchema.parse(req.body);
    next();
  } catch (error) {
    const result = addPhoneSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

const addEmailSchema = z.object({
  email: z.string({ message: "User email is required." }).email(),
});
const addPhoneSchema = z.object({
  phone: z
    .string({ message: "Phone is required" })
    .regex(
      validatePhoneNumber,
      "Invalid phone number format. Expected formats: 01xxxxxxxxx, +8801xxxxxxxxx, or 8801xxxxxxxxx."
    ),
});

export {
  addEmailValidation,
  addPhoneValidation,
  createUserValidation,
  loginUserValidation,
};
