import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

// פונקציה ליצירת OTP רנדומלי בן 6 ספרות
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // יוצר מספר בין 100000 ל-999999
};

// מאגר זמני ל-OTP לפי מספרי טלפון (בפרויקט אמיתי עדיף להשתמש בבסיס נתונים)
const otpStore = {};

export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  // יצירת OTP רנדומלי
  const otp = generateOTP();
  otpStore[phoneNumber] = otp; // שמירת ה-OTP במאגר זמני לפי מספר טלפון

  try {
    // שליחת הודעת WhatsApp עם ה-OTP
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:+972${phoneNumber}`,
    });

    console.log(`OTP sent to ${phoneNumber}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

export const verifyOtp = (req, res) => {
  const { phoneNumber, otp } = req.body;

  // בדיקה אם ה-OTP תואם לזה שנשמר
  if (otpStore[phoneNumber] && otpStore[phoneNumber] === parseInt(otp, 10)) {
    delete otpStore[phoneNumber]; // הסרת ה-OTP לאחר אימות מוצלח
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, error: "Invalid or expired OTP" });
  }
};
