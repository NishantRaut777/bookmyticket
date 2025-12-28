// schemas/authSchemas.ts
import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/;
// Explanation: at least 8 chars, one lowercase, one uppercase, one digit, one special char

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long")
      .trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    phone: z
      .string()
      .trim()
      // loosely validate E.164-like or common local formats (e.g. +919876543210 or 9876543210)
      .regex(
        /^(\+?\d{10,15})$/,
        "Phone must be digits, optionally starting with +, length 10-15"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
    // optional fields:
    profileImage: z.string().url().optional(),
    address: z.string().max(300).optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  // OTP: numeric, typically 4-8 digits — defaulting to 6
const otpRegex = /^\d{4,8}$/;

export const verifyOtpSchema = z.object({
  // Require either email or phone (but at least one)
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^(\+?\d{10,15})$/, "Phone must be digits, optionally starting with +, length 10-15")
    .optional(),

  // OTP code
  otp: z
    .string()
    .regex(otpRegex, "OTP must be numeric and 4-8 digits")
    .min(4)
    .max(8),
}).refine((data) => Boolean(data.email) || Boolean(data.phone), {
  message: "Either email or phone must be provided",
  path: ["email", "phone"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const resendOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().min(4, "OTP is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});