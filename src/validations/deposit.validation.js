import { z } from "zod";

export const depositRequestValidationSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .min(1, { message: "Amount must be greater than 0" }),

  status: z.enum(["pending", "declined", "approved"]).optional(),

  method: z.enum(["bkash", "nagod"], {
    required_error: "Payment method is required",
  }),

  transitionId: z.string({ required_error: "Transaction ID is required" }),
});

export const approveDepositValidationSchema = z.object({
  transitionId: z.string({ required_error: "Transaction ID is required" }),
});

const depositRequestValidation = async (req, res, next) => {
  try {
    req.body = depositRequestValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = depositRequestValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

const approveDepositValidation = async (req, res, next) => {
  try {
    req.body = approveDepositValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = approveDepositValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

export { approveDepositValidation, depositRequestValidation };
