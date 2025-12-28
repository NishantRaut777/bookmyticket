import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // don’t send password in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    resetPasswordOtp: {
      code: String,
      expiresAt: Date,
    },
    profileImage: {
      type: String, // URL or local path
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  { 
    timestamps: true,
    versionKey: false,
    collection: "users"
  }
);

export const usersModel = mongoose.model("users",userSchema)