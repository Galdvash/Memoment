import express from "express";
import multer from "multer";
import {
  createAlbum,
  getAlbumById,
  getAllAlbums,
  deleteAlbum,
  updateAlbumById,
  addImagesToAlbum,
  shareAlbum,
  getSharedAlbums, // ודא שהפונקציה מיובאת
} from "../controllers/albumController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import uploadFields from "../middleware/uploadMiddleware.mjs";
import { checkAlbumLimit } from "../middleware/albumLimitMiddleware.mjs";

const router = express.Router();

// חשוב: הנתיבים הספציפיים באים לפני הנתיבים עם פרמטרים

// נתיב לקבלת האלבומים המשותפים
router.get("/shared", protect, getSharedAlbums);

// נתיב לקבלת כל האלבומים של המשתמש
router.get("/", protect, getAllAlbums);

// נתיב לקבלת אלבום לפי ID
router.get("/:albumId", protect, getAlbumById);

// נתיב לשיתוף אלבום
router.post("/:albumId/share", protect, shareAlbum);

// יצירת אלבום חדש
router.post("/finalize", protect, checkAlbumLimit, uploadFields, createAlbum);

// עדכון אלבום
router.put("/:albumId", protect, updateAlbumById);

// הוספת תמונות לאלבום
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
