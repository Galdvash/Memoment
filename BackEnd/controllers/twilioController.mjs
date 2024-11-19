import crypto from "crypto";
import bcrypt from "bcryptjs";
import Twilio from "twilio";
import User from "../models/UserModel.mjs";

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// פונקציה ליצירת OTP רנדומלי בן 6 ספרות
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// שליחת OTP למספר טלפון דרך WhatsApp
export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // בדיקת פורמט מספר טלפון
    if (!phoneNumber.match(/^0\d+$/)) {
      return res.status(400).json({
        message: "Invalid phone number format. Use numbers starting with 0.",
      });
    }

    // המרה לתבנית בינלאומית (לדוגמה, ישראל)

    // חיפוש משתמש לפי מספר טלפון
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this phone number not found" });
    }

    // בדיקת אם קיים OTP פעיל
    if (user.otp && user.otpExpiresAt > new Date()) {
      return res.status(400).json({
        message: "An active OTP already exists. Please try again later.",
      });
    }

    // יצירת OTP ותוקף
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 1000);
    // שמירת ה-OTP והתוקף בבסיס הנתונים
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // שליחת הקוד למספר הטלפון דרך WhatsApp
    await twilioClient.messages.create({
      body: "Your OTP code is: {{1}}", // כאן נשלחת הודעת OTP עם פלייסהולדר עבור הקוד (הקוד יוכנס במקום {{1}})
      from: "whatsapp:+972523637089", // מספר ה-WhatsApp של Twilio שאתה שולח ממנו (מספר Twilio שלך שמאושר לשימוש ב-WhatsApp)
      to: `whatsapp:+972${phoneNumber.slice(1)}`, // המספר שאליו נשלחת ההודעה. כאן המערך מתייחס למספר טלפון מקומי והופך אותו לפורמט בינלאומי E.164
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// אימות OTP ושמירת טוקן לשינוי סיסמה
export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // מחיקת ה-OTP ותוקפו
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    // יצירת טוקן זמני לשינוי סיסמה
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // תוקף ל-15 דקות
    await user.save();

    res.status(200).json({ message: "OTP verified successfully", resetToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// שינוי סיסמה עם טוקן
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
export const addPhoneNumber = async (req, res) => {
  const { userId, phoneNumber } = req.body;

  try {
    // בדיקת פורמט מספר טלפון - ווידוא שהוא רק מכיל ספרות
    if (!phoneNumber.match(/^\d+$/)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // המרת מספר הטלפון לפורמט E.164 (למשל: +972523637089)
    const formattedPhoneNumber = phoneNumber.startsWith("0")
      ? `+972${phoneNumber.slice(1)}`
      : phoneNumber; // אם כבר בפורמט הנכון, נשאיר את המספר כמו שהוא

    // חיפוש משתמש לפי ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // בדיקה אם מספר הטלפון כבר בשימוש על ידי משתמש אחר
    const existingUser = await User.findOne({
      phoneNumber: formattedPhoneNumber,
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Phone number already associated with another user" });
    }

    // עדכון מספר הטלפון ביוזר
    user.phoneNumber = formattedPhoneNumber;
    await user.save();

    res.status(200).json({ message: "Phone number added successfully" });
  } catch (error) {
    console.error("Error adding phone number:", error);
    res.status(500).json({ message: "Server error" });
  }
};
