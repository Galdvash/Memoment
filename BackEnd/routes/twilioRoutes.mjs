import express from "express";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
  addPhoneNumber,
} from "../controllers/twilioController.mjs";

const router = express.Router();

router.post("/send-otp", sendOtp); // שליחת OTP
router.post("/verify-otp", verifyOtp); // אימות OTP
router.post("/reset-password", resetPassword); // שינוי סיסמה
router.post("/add-phone-number", addPhoneNumber); // הוספת מספר טלפון

export default router;
