import { z } from "zod";

const validatePhoneNumber = /^(?:(?:\+|00)88|01)?\d{11}$/;

const createUserValidationSchema = z.object({
  username: z.string({ message: "username is required" }),
  phone: z
    .string({ message: "Phone is required" })
    .regex(
      validatePhoneNumber,
      "Invalid Bangladeshi phone number format. Expected formats: 01xxxxxxxxx, +8801xxxxxxxxx, or 8801xxxxxxxxx."
    )
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  email: z.string().email().optional(),
  referredBy: z.string().optional(),
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

export { createUserValidation };
