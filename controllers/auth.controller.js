import { generateOTP, generateToken, sendEmail } from "../lib/helper.js";
import { usersModel } from "../models/User.model.js";
import { createRecordInMongo, findInMongo, findInMongoWithSelectQuery } from "../repository/mongoCRUD.js";
import bcrypt from "bcryptjs";

export const registerUser = async(req, res) => {
    try {
        const { fullName, email, phone, password } = req.validatedData;

        const existingUser = await findInMongo(usersModel, { email: email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists with this email" })
        }

        const otpCode = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

        const hashedPasswd = await bcrypt.hash(password, 10)

        await createRecordInMongo(usersModel, {
            fullName,
            email,
            phone,
            password: hashedPasswd,
            otp: {
                code: otpCode,
                expiresAt: otpExpiry
            }
        });

        await sendEmail(email, "Verification Code", `Your verification otp is ${otpCode}`)

        return res.status(201).json({ message: "Registered successfully. Please verify your otp" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}

export const verifyOtp = async(req, res) => {
    try {
        const { email, otp } = req.validatedData;

        const existingUser = await findInMongo(usersModel, { email: email });
        if(!existingUser){
            return res.status(400).json({ message: "User not found" })
        }

        if(!existingUser.otp || existingUser.otp.code != otp || existingUser.otp.expiresAt < Date.now()){
            return res.status(400).json({ message: "Invalid or expired otp"})
        }

        existingUser.isVerified = true;
        existingUser.otp = undefined;

        await existingUser.save();

        return res.status(201).json({ message: "Account verified successfully", existingUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}

export const loginUser = async(req, res) => {
    try {
      const { email, password } = req.validatedData;

      const user = await findInMongoWithSelectQuery(
        usersModel,
        { email: email },
        "+password +refreshToken"
      );

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!user.isVerified) {
        return res.status(400).json({ message: "Please verify your email first" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ userId: user._id });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ success: true, message: "Login successful" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
   
}

export const resendOTP = async(req,res) => {
    try {
        const { email } = req.validatedData;

        const user = await findInMongo(usersModel, { email });

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if(user.isVerified){
            return res.status(400).json({ message: "User already verified" });
        }

        const newOtp = generateOTP();
        user.otp.code = newOtp;
        user.otp.expiresAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendEmail(email, "Verification Code", `Your verification otp is ${newOtp}`)

        return res.status(200).json({ success: true, message: "Otp sent successfully. Please verify your otp" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
} 

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.validatedData;

        const user = await findInMongo(usersModel, { email });

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = generateOTP();
        user.resetPasswordOtp.code = otp;
        user.resetPasswordOtp.expiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        await sendEmail(email, "Password reset otp", `Your password reset otp is ${otp}`)

        return res.status(200).json({ success: true, message: "Password reset otp sent successfully. Please verify your otp" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}

export const resetPassword = async(req, res) => {
    try {
        const { email, otp, newPassword } = req.validatedData;

        const user = await findInMongo(usersModel, { email });

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if(!user.resetPasswordOtp.code || user.resetPasswordOtp.code != otp){
            return res.status(400).json({ message: "Invalid otp" });
        }

        if (user.resetPasswordOtp.expiresAt < Date.now()){
            return res.status(400).json({ message: "Otp expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear reset fields
        user.resetPasswordOtp.code = undefined;
        user.resetPasswordOtp.expiresAt = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}