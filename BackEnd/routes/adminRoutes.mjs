import express from "express";
import {
  getUserAlbums,
  updateUser,
  getAllUsers,
} from "../controllers/adminController.mjs";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.put("/users/:id", isAuthenticated, isAdmin, updateUser);
router.get("/users/:userId/albums", isAuthenticated, isAdmin, getUserAlbums);

router.get("/users", isAuthenticated, isAdmin, getAllUsers);

export default router;
