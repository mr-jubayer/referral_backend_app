import { z } from "zod";

const validatePhoneNumber = /^(?:(?:\+|00)88|01)?\d{11}$/;

export const withdrawRequestValidationSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .min(100, { message: "Amount must be greater than 100" }),

  phone: z
    .string({ message: "Phone is required" })
    .regex(
      validatePhoneNumber,
      "Invalid phone number format. Expected formats: 01xxxxxxxxx, +8801xxxxxxxxx, or 8801xxxxxxxxx."
    ),
  method: z.enum(["bkash", "nagod"], {
    required_error: "Payment method is required",
  }),
});

export const approveWithdrawValidationSchema = z.object({
  userId: z.string({ message: "withdraw " }),
  withdrawId: z.string({ message: "withdraw " }),
});

const withdrawRequestValidation = async (req, res, next) => {
  try {
    req.body = withdrawRequestValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = withdrawRequestValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};
const approveWithdrawValidation = async (req, res, next) => {
  try {
    req.body = approveWithdrawValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = approveWithdrawValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

export { approveWithdrawValidation, withdrawRequestValidation };
