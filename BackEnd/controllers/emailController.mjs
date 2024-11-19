import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/UserModel.mjs";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Attempting to find user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // יצירת טוקן ייחודי
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated reset token:", resetToken);

    // שמירת הטוקן עם תוקף של שעה
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // שעה אחת
    await user.save();
    console.log("Saved reset token to user:", user);

    // יצירת URL לאיפוס סיסמה
    const resetUrl = `${
      process.env.NODE_ENV === "production"
        ? process.env.API_URL_PRODUCTION
        : process.env.API_URL_DEVELOPMENT
    }/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);
    const message = `
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // שליחת האימייל
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: message,
    });
    console.log("Email sent successfully");

    res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  } finally {
    console.log("Email process finished");
  }
};
