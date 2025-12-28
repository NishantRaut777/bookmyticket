import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/;
// Explanation: at least 8 chars, one lowercase, one uppercase, one digit, one special char

export const updateUserSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  address: z.string().min(3, "Address must be at least 3 characters").optional(),
  paasword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain uppercase, lowercase, number and special character"
        ).optional()
});