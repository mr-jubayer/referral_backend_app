import { User } from "../../models/user.model.js";
import { Withdraw } from "../../models/withdraw.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const withdrawRequest = asyncHandler(async (req, res) => {
  const { amount, phone, method } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(403, "User Not Found");
  }

  if (user.bonusBalance < amount) {
    throw new ApiError(400, "Insufficient balance");
  }

  const recentRequest = await Withdraw.findOne({
    userId,
    createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }, // last 5 mins
  });

  if (recentRequest) {
    throw new ApiError(429, "Please wait before making another withdrawal");
  }

  const newWithdrawal = await Withdraw.create({
    userId,
    amount,
    phone,
    method,
  });

  user.wallet.bonusBalance -= amount;
  await user.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        requestId: newWithdrawal._id,
      },
      "Withdraw request successful"
    )
  );
});

export { withdrawRequest };
