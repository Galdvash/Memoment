// routes/userRoutes.mjs
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateEmail,
  updatePassword,
  updateName,
  verifyPassword,
  addPhoneNumber,
  resetPassword,
} from "../controllers/userController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import { sendResetEmail } from "../controllers/emailController.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

// נתיבים נוספים
router.put("/update-email", protect, updateEmail);
router.put("/update-password", protect, updatePassword);
router.put("/update-name", protect, updateName); // נתיב חדש לעדכון שם
router.post("/verify-password", protect, verifyPassword);

router.post("/forgot-password", sendResetEmail);
router.post("/reset-password", resetPassword); // איפוס סיסמה באמצעות טוקן
router.post("/add-phone-number", protect, addPhoneNumber);

export default router;
