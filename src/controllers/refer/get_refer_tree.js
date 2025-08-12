import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Recursive function to build referral tree
const buildReferralTree = async (referralCode) => {
  const referredUsers = await User.find(
    { referredBy: referralCode },
    { username: 1, referralCode: 1 }
  ).lean();

  const tree = [];
  for (const user of referredUsers) {
    tree.push({
      username: user.username,
      referralCode: user.referralCode,
      referralChildren: await buildReferralTree(user.referralCode), // recursion
    });
  }

  return tree;
};

const getReferTree = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Admin only access this route
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  // Get all root users (those who were not referred by anyone)
  const rootUsers = await User.find(
    { referredBy: null },
    { username: 1, referralCode: 1 }
  ).lean();

  const referTree = [];
  for (const user of rootUsers) {
    referTree.push({
      username: user.username,
      referralCode: user.referralCode,
      referralChildren: await buildReferralTree(user.referralCode),
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { referTree },
        "Populated Referral Tree Successfully"
      )
    );
});

export { getReferTree };
