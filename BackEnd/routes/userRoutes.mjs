// routes/userRoutes.mjs

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAllUsers,
} from "../controllers/userController.mjs";
import { protect, authorizeRoles } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getMe);

// רק מנהל יכול לגשת לרשימת כל המשתמשים
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

export default router;
