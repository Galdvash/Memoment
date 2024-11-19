// routes/userRoutes.mjs
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAllUsers,
  updateEmail,
  updatePassword,
  updateName,
  verifyPassword,
} from "../controllers/userController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.get("/users", protect, getAllUsers);

// נתיבים נוספים
router.put("/update-email", protect, updateEmail);
router.put("/update-password", protect, updatePassword);
router.put("/update-name", protect, updateName); // נתיב חדש לעדכון שם
// routes/userRoutes.mjs
router.post("/verify-password", protect, verifyPassword);

export default router;
