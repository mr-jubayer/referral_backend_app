import { Refer } from "../../models/refer.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "./login_user.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, phone, email, password, referredBy } = req.body;

  if (email && phone) {
    throw new ApiError(400, "Cannot read email and phone number at a time!");
  }

  let existedUser;

  if (username) {
    existedUser = await User.findOne({ username });
    checkError(existedUser, "User with the same username already exists.");
  } else if (email) {
    existedUser = await User.findOne({ email });
    checkError(existedUser, "User with the same email already exists.");
  } else {
    existedUser = await User.findOne({ phone });
    checkError(existedUser, "User with the same phone number already exists.");
  }

  function checkError(existedUser, message) {
    if (existedUser) {
      throw new ApiError(409, message);
    }
  }

  if (referredBy) {
    const isExistReferredCode = await User.findOne({
      referralCode: referredBy,
    });

    if (!isExistReferredCode) {
      throw new ApiError(404, `Referred code '${referredBy}' isn't available`);
    }
  }

  const referralCode = `${username.toUpperCase()}${Math.round(
    Math.random() * 80
  )}`;

  const user = await User.create({
    username: username.toLowerCase(),
    phone: phone || null,
    password,
    email: email || null,
    referralCode,
    referredBy: referredBy || null,
  });

  if (referredBy) {
    await Refer.create({
      referredBy,
      referredUserId: user._id,
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

export { registerUser };
