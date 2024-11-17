// routes/eventRoutes.js
import express from "express";
import {
  createEvent,
  getEventById,
  getUserEvents,
  updateEvent,
  deleteEvent,
  getUserEventsWithAlbums,
} from "../controllers/eventController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// יצירת אירוע חדש
router.post("/", protect, createEvent);

// קבלת כל האירועים של המשתמש
router.get("/", protect, getUserEvents);

// קבלת אירוע לפי ID
router.get("/:eventId", protect, getEventById);

// עדכון אירוע
router.put("/:eventId", protect, updateEvent);

// מחיקת אירוע
router.delete("/:eventId", protect, deleteEvent);

// קבלת כל האירועים עם האלבומים שלהם
router.get("/user-events/with-albums", protect, getUserEventsWithAlbums);

export default router;
