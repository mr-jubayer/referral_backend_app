import { User } from "../../models/user.model.js";
import { Withdraw } from "../../models/withdraw.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const withdrawRequest = asyncHandler(async (req, res) => {
  const { amount, phone, method, userId } = req.body;
  const _id = req.user._id;

  if (!_id.equals(userId)) {
    throw new ApiError(400, "User id not matched");
  }

  const user = await User.findById(_id);

  if (!user) {
    throw new ApiError(403, "User Not Found");
  }

  const remainBalance = user.wallet.mainBalance - amount;
  const withdrawalBalance = user.wallet.mainBalance - 500;

  if (!(remainBalance >= 500)) {
    throw new ApiError(400, "Insufficient balance");
  }

  if (!(withdrawalBalance >= amount)) {
    throw new ApiError(400, "Insufficient balance");
  }

  const todayTotalWithdrawn = await Withdraw.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // last 24 hour history
      },
    },
    {
      $group: {
        _id: null,
        totalWithdrawn: { $sum: "$amount" },
      },
    },
  ]);

  const totalWithdrawn =
    todayTotalWithdrawn.length > 0 ? todayTotalWithdrawn[0].totalWithdrawn : 0;

  if (totalWithdrawn + amount >= 10000) {
    throw new ApiError(
      403,
      "Today withdraw request limit exceeded. Try again after 24 hours"
    );
  }

  // const recentRequest = await Withdraw.findOne({
  //   userId,
  //   createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }, // last 5 mins
  // });

  // if (recentRequest) {
  //   throw new ApiError(
  //     429,
  //     "Please wait 5 minute before making another withdrawal"
  //   );
  // }

  const newWithdrawal = await Withdraw.create({
    userId,
    amount,
    phone,
    method,
  });

  user.wallet.mainBalance -= amount;
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
