import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(201).json({ status: 200, message: "Health is Okay" });
});

export { healthCheck };
