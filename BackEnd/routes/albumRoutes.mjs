import express from "express";
import multer from "multer";
import {
  createAlbum,
  getAlbumById,
  getAllAlbums,
  deleteAlbum,
  updateAlbumById,
  addImagesToAlbum,
} from "../controllers/albumController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import uploadFields from "../middleware/uploadMiddleware.mjs";

const router = express.Router();

router.get("/", protect, getAllAlbums);
router.get("/:albumId", protect, getAlbumById);

// יצירת אלבום חדש
router.post("/finalize", protect, uploadFields, createAlbum);

// עדכון אלבום (ללא העלאת קבצים)
router.put("/:albumId", protect, updateAlbumById);

// הוספת תמונות לאלבום קיים
router.post(
  "/:albumId/images",
  protect,
  multer({ limits: { fileSize: 10 * 1024 * 1024 } }).array("images", 20),
  addImagesToAlbum
);

// מחיקת אלבום
router.delete("/:albumId", protect, deleteAlbum);

// טיפול בשגיאות
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

export default router;
