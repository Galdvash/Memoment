import express from "express";
import { sendOtp, verifyOtp } from "../controllers/twilioController.mjs";

const router = express.Router();

// Route לשליחת ה-OTP
router.post("/send-otp", sendOtp);

// Route לאימות ה-OTP
router.post("/verify-otp", verifyOtp);

export default router;
