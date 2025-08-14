import { Deposit } from "../../models/deposit.model.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const depositReview = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Admin only access this route
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const deposits = await Deposit.aggregate([
    {
      $addFields: {
        sortOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "pending"] }, then: 1 },
              { case: { $eq: ["$status", "approved"] }, then: 2 },
              { case: { $eq: ["$status", "cancelled"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },
    { $sort: { sortOrder: 1, createdAt: -1 } },
    { $project: { sortOrder: 0 } },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, { deposits }, "Deposits review populated"));
});

export { depositReview };
