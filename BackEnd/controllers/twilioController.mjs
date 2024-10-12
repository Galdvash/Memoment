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

// Controller to send SMS with OTP to all phone numbers
export const sendSMSWithOTP = async (req, res) => {
  try {
    // Retrieve all phone numbers from the database
    const phoneRecords = await Phone.find();

    for (const { name, phoneNumber } of phoneRecords) {
      const otp = generateOTP(); // Generate OTP for each number

      // Save the OTP with the phone record in MongoDB
      await Phone.updateOne({ phoneNumber }, { otp });

      // Send OTP and message using Twilio
      const message = `שלום ${name}, הנה קוד האימות שלך: ${otp}`;
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+972${phoneNumber}`,
      });
      console.log(`OTP sent to ${phoneNumber}`);
    }

    res.status(200).json({ message: "OTP messages sent successfully" });
  } catch (error) {
    console.error("Error sending OTP messages:", error);
    res.status(500).send("Error sending OTP messages");
  }
};

// Controller to verify the OTP
export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const phoneRecord = await Phone.findOne({ phoneNumber });

    if (!phoneRecord || phoneRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, grant access to album link
    res.status(200).json({
      message: "OTP verified successfully",
      albumLink: "https://yourdomain.com/event-album", // The link to the event album
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP");
  }
};
