// routes/userRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/userController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// נתיב להרשמת משתמש חדש
router.post("/register", registerUser);

// נתיב להתחברות משתמש
router.post("/login", loginUser);

// נתיב להתנתקות משתמש
router.post("/logout", logoutUser);

// נתיב לקבלת מידע על המשתמש המחובר
router.get("/me", protect, getMe);

export default router;
