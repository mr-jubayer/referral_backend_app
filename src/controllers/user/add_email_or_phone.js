import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User doesn't exist.");

  user.emails.push({ email, isVerified: false });
  // verify the email

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Email added successfully"));
});

const addPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User doesn't exist.");

  user.phones.push({ phone, isVerified: false });

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Phone added successfully"));
});

export { addEmail, addPhone };
