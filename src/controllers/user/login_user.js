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
  const { phone, email, username, password } = req.body;

  if (!password) throw new ApiError(400, "Password is required");

  if (
    (phone && email && username) ||
    (phone && email) ||
    (phone && username) ||
    (username && email)
  ) {
    throw new ApiError(404, "You must user way");
  }

  let user;

  if (username) {
    user = await User.findOne({ username });
    checkError(user, "Username doesn't exist.");
  } else if (email) {
    user = await User.findOne({ email });
    checkError(user, "Email doesn't exist.");
  } else {
    user = await User.findOne({ phone });
    checkError(user, "Phone number doesn't exist.");
  }

  function checkError(user, message) {
    if (!user) {
      throw new ApiError(404, message);
    }
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
