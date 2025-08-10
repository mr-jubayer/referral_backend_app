import { User } from "../../models/user.model.js";
import { Withdraw } from "../../models/withdraw.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const approveWithdraw = asyncHandler(async (req, res) => {
  const { userId, withdrawId } = req.body;
  const adminId = req.user._id;

  // Verify admin
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  // Get withdrawal request
  const withdraw = await Withdraw.findById(withdrawId);
  if (!withdraw) {
    throw new ApiError(404, "Withdrawal request not found.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Ensure withdrawal belongs to user
  if (withdraw.userId.toString() !== user._id.toString()) {
    throw new ApiError(400, "Withdrawal does not belong to this user.");
  }

  // Ensure withdrawal is still pending
  if (withdraw.status !== "pending") {
    throw new ApiError(400, "Withdrawal request is not pending.");
  }

  const amount = withdraw.amount;
  const remainBalance = user.wallet.mainBalance - amount;
  const withdrawalBalance = user.wallet.mainBalance - 500;

  if (!(remainBalance >= 500) || !(withdrawalBalance >= amount)) {
    withdraw.status = "declined";
    await withdraw.save();
    throw new ApiError(400, "Insufficient balance to approve withdrawal.");
  }

  // Approve withdrawal
  withdraw.status = "approved";
  await withdraw.save();

  // decrease from user's balance
  user.wallet.mainBalance -= amount;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { approvedId: withdraw._id },
        "Withdrawal approved successfully."
      )
    );
});

export { approveWithdraw };
