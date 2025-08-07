import { Deposit } from "../../models/deposit.model.js";
import { Refer } from "../../models/refer.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const approveDeposit = asyncHandler(async (req, res) => {
  const { transitionId } = req.body;
  const adminId = req.user._id;

  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  if (!transitionId || typeof transitionId !== "string") {
    throw new ApiError(400, "Invalid transition ID");
  }

  const depositTransition = await Deposit.findOne({ transitionId });
  if (!depositTransition || depositTransition.status !== "pending") {
    throw new ApiError(
      404,
      "deposit already approved or transaction not found"
    );
  }

  let user = await User.findById(depositTransition.userId);
  if (!user) {
    throw new ApiError(404, "User not found or may removed");
  }

  if (user?.referredBy) {
    const referralInfo = await Refer.findOne({ referredBy: user.referredBy });

    if (!referralInfo.isBonusGiven) {
      await distributeFiveLevelBonus(user);
      referralInfo.isBonusGiven = true;
      await referralInfo.save();

      await addDepositMoney();
    } else {
      await addDepositMoney();
    }
  } else {
    await addDepositMoney();
  }

  async function addDepositMoney() {
    user.wallet.mainBalance += depositTransition.amount;
    await user.save();
  }

  depositTransition.status = "approved";
  await depositTransition.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        depositInfo: depositTransition,
        user,
      },
      "Deposit request approved"
    )
  );
});

export { approveDeposit };

const distributeFiveLevelBonus = async (user) => {
  let currentUser = await User.findOne({ referralCode: user.referredBy });
  let bonus = [200, 100, 50, 20, 20];

  for (let r = 0; r < 5; r++) {
    currentUser.wallet.bonusBalance += bonus[r];
    await currentUser.save();
    // console.log(currentUser.username, currentUser.referredBy);

    currentUser = await User.findOne({ referralCode: currentUser.referredBy });
  }
};
