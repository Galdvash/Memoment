// backend/routes/face.mjs
import express from "express";
import { matchFaces } from "../controllers/faceController.mjs";
import { protect } from "../middleware/authMiddleware.mjs"; // עדכון הנתיב למידלוואר הקיים

const router = express.Router();

// POST /api/face/match-faces/:albumId/:userId
router.post("/match-faces/:albumId/:userId", protect, matchFaces);

export default router;
