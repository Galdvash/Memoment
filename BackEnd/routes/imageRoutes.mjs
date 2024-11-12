import express from "express";
import {
  uploadImages,
  getImages,
  upload,
  getImageByFilename,
} from "../controllers/imageController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
// קונפיגורציה להעלאת קבצים

const router = express.Router();

// מסלול להעלאת תמונות (מוגן)
router.post("/upload", protect, upload.array("images"), uploadImages);

// מסלול לשליפת תמונות עבור המשתמש המחובר (מוגן)
router.get("/", protect, getImages);
router.get("/:filename", protect, getImageByFilename);

export default router;
