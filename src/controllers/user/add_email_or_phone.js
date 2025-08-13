import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User doesn't exist.");

  user.emails?.forEach((emailObj) => {
    if (emailObj.email === email) {
      throw new ApiError(404, "Email Already exist");
    }
  });

  if (user.emails?.length > 3) {
    throw new ApiError(401, "Maximum email added");
  }

  user.emails.push({ email, isVerified: false });

  // TODO: verify the email

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Email added successfully"));
});

const addPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  user.phones?.forEach((ph) => {
    if (ph === phone) {
      throw new ApiError(404, "Phone Already exist");
    }
  });

  if (user.phones?.length > 3) {
    throw new ApiError(401, "Maximum phone number added");
  }

  if (!user) throw new ApiError(404, "User doesn't exist.");

  user.phones.push(phone);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Phone added successfully"));
});

export { addEmail, addPhone };
