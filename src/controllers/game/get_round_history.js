import { Round } from "../../models/round.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRoundHistory = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  // Verify admin
  const isAdmin = await User.findById(adminId);
  if (!isAdmin || isAdmin.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const roundHistory = await Round.find({});

  return res.status(201).json({
    status: 200,
    data: { rounds: roundHistory },
    message: "Populated Round history",
  });
});

export { getRoundHistory };
