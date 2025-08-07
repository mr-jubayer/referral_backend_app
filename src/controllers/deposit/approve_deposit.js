import { Deposit } from "../../models/deposit.model.js";
import { Refer } from "../../models/refer.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const approveDeposit = asyncHandler(async (req, res) => {
  const { transitionId } = req.body;
  // req.user <- data coming by jwt verified data's
  const adminId = req.user._id;

  // Admin only access this route
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

  // find user by id from depositTransition
  let user = await User.findById(depositTransition.userId);
  if (!user) {
    throw new ApiError(404, "User not found or may removed");
  }

  // If user user any refer code
  if (user?.referredBy) {
    const referralInfo = await Refer.findOne({ referredBy: user.referredBy });

    // If referral bonus is not given or User if depositing first time
    if (!referralInfo.isBonusGiven) {
      await distributeFiveLevelBonus(user);
      referralInfo.isBonusGiven = true;
      await referralInfo.save();

      await addDepositMoney();
    } else {
      await addDepositMoney();
    }
  } else {
    // user haven't used any refer code
    await addDepositMoney();
  }

  // confirm deposit and add money in user account
  async function addDepositMoney() {
    user.wallet.mainBalance += depositTransition.amount;
    await user.save();
  }

  // change status
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
  // Find referred user
  let currentUser = await User.findOne({ referralCode: user.referredBy });
  let bonus = [200, 100, 50, 20, 20];

  for (let r = 0; r < 5; r++) {
    // assign bonus and update it
    currentUser.wallet.bonusBalance += bonus[r];
    await currentUser.save();
    // console.log(currentUser.username, currentUser.referredBy);

    // Next next level user. 5 -> 4 -> 3 -> 2 -> 1 -> break
    currentUser = await User.findOne({ referralCode: currentUser.referredBy });
  }
};
