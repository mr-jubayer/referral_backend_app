import { Deposit } from "../../models/deposit.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const depositRequest = asyncHandler(async (req, res) => {
  const { amount, method, transitionId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(403, "User not found or unauthorized");
  }
  const checkTransition = await Deposit.findOne({ transitionId });
  if (checkTransition) {
    throw new ApiError(
      403,
      "This transitionId already used try with different one"
    );
  }

  const newDeposit = await Deposit.create({
    userId,
    amount,
    status: "pending",
    method,
    transitionId,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        deposit: newDeposit,
      },
      "Deposit request created and pending approval"
    )
  );
});

export { depositRequest };
