import Twilio from "twilio";
import Phone from "../models/phoneModel.mjs"; // Import the Phone model
import crypto from "crypto"; // For generating OTP

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

// Function to generate random OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999); // Generate 6-digit OTP
};
export const sendSMSWithOTP = async (req, res) => {
  const { phoneNumber } = req.body; // קבלת מספר טלפון מגוף הבקשה

  try {
    // חיפוש הרשומה של המספר במאגר הנתונים
    const phoneRecord = await Phone.findOne({ phoneNumber });
    if (!phoneRecord) {
      return res.status(404).json({ message: "Phone number not found" });
    }

    const otp = generateOTP(); // יצירת OTP

    // שמירת ה-OTP במאגר הנתונים
    await Phone.updateOne({ phoneNumber }, { otp });

    // שליחת הודעת SMS עם ה-OTP
    const message = `שלום ${phoneRecord.name}, הנה קוד האימות שלך: ${otp}`;
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+972${phoneNumber}`, // שליחת לישראל בלבד
    });

    console.log(`OTP sent to ${phoneNumber}`);
    res.status(200).json({ message: `OTP sent to ${phoneNumber}` });
  } catch (error) {
    console.error("Error sending OTP message:", error);
    res.status(500).send("Error sending OTP message");
  }
};

// Controller to verify the OTP
export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const phoneRecord = await Phone.findOne({ phoneNumber });

    if (
      !phoneRecord ||
      phoneRecord.otp !== otp ||
      phoneRecord.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid
    res.status(200).json({
      message: "OTP verified successfully",
      albumLink: "https://yourdomain.com/event-album",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP");
  }
};
