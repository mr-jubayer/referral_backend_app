import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phones: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
    },
    emails: {
      type: [
        {
          email: { type: String, lowercase: true, trim: true, required: true },
          isVerified: { type: Boolean, default: false },
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    referralCode: {
      type: String,
    },
    referredBy: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    wallet: {
      mainBalance: { type: Number, default: 0 },
      referralIncome: { type: Number, default: 0 },
      demoBalance: { type: Number, default: 500 },
      totalEarned: { type: Number, default: 0 },
      totalWithdrawn: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 3;
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      phone: this.phone,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
