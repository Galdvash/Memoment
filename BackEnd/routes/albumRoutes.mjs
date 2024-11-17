// routes/albumRoutes.mjs
import express from "express";
import {
  createAlbum,
  getAlbumById,
  getAllAlbums,
} from "../controllers/albumController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import uploadFields from "../middleware/uploadMiddleware.mjs"; // ייבוא המידלוור החדש

const router = express.Router();

// שימוש במידלוור uploadFields בנתיב ה-POST
router.post(
  "/finalize",
  protect,
  uploadFields, // שימוש במידלוור החדש
  createAlbum
);

router.get("/", protect, getAllAlbums);
router.get("/:albumId", protect, getAlbumById);

export default router;
