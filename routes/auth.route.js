import express from "express";
import { validate } from "../middleware/validate.js";
import { validateUser } from "../middleware/validateUser.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from "../zodValidations/authValidation.js";
import { forgotPassword, loginUser, logoutUser, registerUser, resendOTP, resetPassword, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", [validate(registerSchema)], registerUser)
router.post("/verify-otp", [validate(verifyOtpSchema)], verifyOtp)
router.post("/login", validate(loginSchema), loginUser)
router.post("/resend-otp", validate(resendOtpSchema), resendOTP)
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
router.post("/reset-password", [validate(resetPasswordSchema)], resetPassword)
router.post("/logout", [validateUser], logoutUser)

export const authRoutes = router;