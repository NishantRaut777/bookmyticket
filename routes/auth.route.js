import express from "express";
import { validate } from "../middleware/validate.js";
import { validateUser } from "../middleware/validateUser.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from "../zodValidations/authValidation.js";
import { forgotPassword, loginUser, logoutUser, registerUser, resendOTP, resetPassword, verifyOtp } from "../controllers/auth.controller.js";
import { generalLimiter, otpLimiter } from "../lib/helper.js";

const router = express.Router();

router.post("/register", [otpLimiter, validate(registerSchema)], registerUser)
router.post("/verify-otp", [otpLimiter, validate(verifyOtpSchema)], verifyOtp)
router.post("/login", [generalLimiter, validate(loginSchema)], loginUser)
router.post("/resend-otp", [generalLimiter, validate(resendOtpSchema)], resendOTP)
router.post("/forgot-password", [generalLimiter, validate(forgotPasswordSchema)], forgotPassword)
router.post("/reset-password", [generalLimiter, validate(resetPasswordSchema)], resetPassword)
router.post("/logout", [validateUser], logoutUser)

export const authRoutes = router;