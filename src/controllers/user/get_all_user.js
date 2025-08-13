import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Admin only access this route
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const users = await User.find(
    {},
    {
      username: 1,
      email: 1,
      wallet: 1,
      createdAt: 1,
    }
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        users,
      },
      "Populate all user successfully"
    )
  );
});

export { getAllUser };
