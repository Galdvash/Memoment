import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/UserModel.mjs";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // שעה אחת
    await user.save();

    const resetLink = `${
      process.env.NODE_ENV === "production"
        ? process.env.API_URL_PRODUCTION
        : process.env.API_URL_DEVELOPMENT
    }/reset-password/${resetToken}`;

    const message = `
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Please click the link below to reset your password within 5 minutes:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Error sending reset email" });
  }
});
