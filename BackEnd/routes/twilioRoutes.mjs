import express from "express";
import { sendSMSWithOTP, verifyOTP } from "../controllers/twilioController.mjs";

const router = express.Router();

// Route to send SMS with OTP to all phone numbers
router.post("/send-sms", sendSMSWithOTP);

// Route to verify the OTP
router.post("/verify-otp", verifyOTP);

export default router;
