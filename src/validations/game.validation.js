import { z } from "zod";

export const betValidationSchema = z.object({
  roundId: z.number({ required_error: "roundId is required" }),

  team: z.enum(["red", "green"]),

  amount: z.number({ required_error: "Amount is required" }),
});

const betValidation = async (req, res, next) => {
  try {
    req.body = betValidationSchema.parse(req.body);
    next();
  } catch (error) {
    const result = betValidationSchema.safeParse(req.body);
    res.status(400).json({
      status: 400,
      errors: result.error,
    });
  }
};

export { betValidation };
