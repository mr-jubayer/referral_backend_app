import { z } from "zod";

export const createDepositValidationSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .min(1, { message: "Amount must be greater than 0" }),

  status: z.enum(["pending", "declined", "approved"]).optional(),

  method: z.enum(["bkash", "nagod"], {
    required_error: "Payment method is required",
  }),

  transitionId: z
    .string({ required_error: "Transaction ID is required" })
    .min(4, { message: "Transaction ID must be at least 4 characters long" }),
});

const createUserValidation = async (req, res, next) => {
  try {
    req.body = createDepositValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = createDepositValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

export { createUserValidation };
