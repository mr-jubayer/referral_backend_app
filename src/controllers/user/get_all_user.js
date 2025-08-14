import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js"; // you were throwing ApiError but not importing
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Admin check
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  // Query params
  const search = req.query.search?.trim().toLowerCase() || "";
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  let filter = {};
  if (search) {
    filter = {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { "emails.email": { $regex: search, $options: "i" } },
      ],
    };
  }

  // Get total count for pagination
  const totalUsers = await User.countDocuments(filter);

  // Fetch paginated users
  const users = await User.find(filter, {
    username: 1,
    emails: 1,
    wallet: 1,
    createdAt: 1,
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      },
      "Users fetched successfully"
    )
  );
});

export { getAllUser };
