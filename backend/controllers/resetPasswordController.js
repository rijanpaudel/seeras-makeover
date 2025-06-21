import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/emailService.js";
import generateOTP from '../utils/generateOTP.js';

let tempOTPStore = {}

export const verifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = generateOTP();

        tempOTPStore[email] = {
            email,
            otp,
            createdAt: Date.now(),
        };

        await sendEmail(
            email,
            "Your OTP for Reset Password",
            `Your OTP is ${otp}`,
            `</h2><p>Your OTP is: <strong>${otp}</strong></p>`
        );

        res.status(200).json({ message: "OTP sent to your email. Please verify." });

    } catch (error) {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Internal server error" });
    };

}

export const verifyOTPReset = async (req, res) => {
  const { email, otp } = req.body;

  const record = tempOTPStore[email];
  if (!record) {
    return res.status(400).json({ message: "OTP expired or not requested." });
  }

  if(record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  record.verified = true; // Mark OTP as verified
  
  return res.status(200).json({ message: "OTP verified successfully! You can now reset your password." });
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const record = tempOTPStore[email];
    if (!record || !record.verified) {
        return res.status(400).json({ message: "OTP not verified or expired." });
    }

    try{
        const user  = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete tempOTPStore[email]; // Clear OTP record after successful reset
    return res.status(200).json({ message: "Password reset successfully!" });
}

    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

