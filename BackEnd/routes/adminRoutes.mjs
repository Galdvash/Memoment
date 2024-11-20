import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserDetails,
} from "../controllers/adminController.mjs";
import { protect, adminOnly } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers); // שליפת כל המשתמשים
router.put("/users/:id/role", protect, adminOnly, updateUserRole); // עדכון תפקיד
router.delete("/users/:id", protect, adminOnly, deleteUser); // מחיקת משתמש
router.get("/users/:id/details", protect, adminOnly, getUserDetails); // שליפת פרטי משתמש ספציפיים

export default router;
