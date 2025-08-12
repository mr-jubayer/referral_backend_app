import { Deposit } from "../../models/deposit.model.js";
import { User } from "../../models/user.model.js";
import { Withdraw } from "../../models/withdraw.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(403, "User not found or unauthorized");
  }

  // Total Deposited
  const totalDepositResult = await Deposit.aggregate([
    {
      $match: {
        userId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const totalDeposit =
    totalDepositResult.length > 0 ? totalDepositResult[0].totalAmount : 0;

  // Total referral income
  const totalReferralIncome = user.wallet?.referralIncome || 0;

  // Total Withdrawn
  const totalWithdrawnResult = await Withdraw.aggregate([
    {
      $match: {
        userId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const totalWithdrawn =
    totalWithdrawnResult.length > 0 ? totalWithdrawnResult[0].totalAmount : 0;

  // Pending Withdrawn
  const pendingWithdrawn = await Withdraw.aggregate([
    {
      $match: {
        userId,
        status: "pending",
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
        phone: 1,
        method: 1,
        createdAt: 1,
      },
    },
  ]);

  // Pending Deposits
  const pendingDeposits = await Deposit.aggregate([
    {
      $match: {
        userId,
        status: "pending",
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
        phone: 1,
        method: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        dashboardData: {
          totalDeposit,
          totalReferralIncome,
          totalWithdrawn,
          pendingWithdrawn,
          pendingDeposits,
        },
      },
      "User dashboard data populated successfully."
    )
  );
});

export { getUserDashboardData };
