import { Deposit } from "../../models/deposit.model.js";
import { User } from "../../models/user.model.js";
import { Withdraw } from "../../models/withdraw.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getStates = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Verify admin
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const totalUsers = await User.countDocuments();

  // Total deposits sum
  const totalDepositsAgg = await Deposit.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalDeposits = totalDepositsAgg[0]?.total || 0;

  // Total withdrawals sum
  const totalWithdrawalsAgg = await Withdraw.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalWithdrawals = totalWithdrawalsAgg[0]?.total || 0;

  // Pending withdrawals count
  const pendingWithdrawals = await Withdraw.countDocuments({
    status: "pending",
  });

  return res.status(201).json({
    status: 200,
    data: {
      totalUsers,
      totalDeposits,
      totalWithdrawals,
      pendingWithdrawals,
    },
    message: "Health is Okay",
  });
});

export { getStates };
