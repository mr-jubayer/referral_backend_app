import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found during token generation");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const loginUser = asyncHandler(async (req, res) => {
  const { phone, email, password } = req.body;

  if (!password) throw new ApiError(400, "Password is required");

  if (!phone && !email) {
    throw new ApiError(400, "Either phone or email must be provided");
  }

  if (phone && email) {
    throw new ApiError(400, "Please provide either phone or email, not both");
  }

  let user;

  if (email) {
    user = await User.findOne({ "emails.email": email });

    if (!user) throw new ApiError(404, "Email doesn't exist.");

    //  check if email not verified
    // user.emails?.forEach((em) => {
    //   if (em.email === email && !em.isVerified) {
    //     throw new ApiError(404, "Email Not verified. verify it and try again");
    //   }
    // });
  } else if (phone) {
    user = await User.findOne({ phones: phone });
    if (!user) throw new ApiError(404, "Phone number doesn't exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

export { loginUser };
