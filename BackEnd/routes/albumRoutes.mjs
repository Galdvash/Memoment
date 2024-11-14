import express from "express";
import {
  finalizeAlbum,
  getAlbumById,
  getAllAlbums,
} from "../controllers/albumController.mjs";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/finalize",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "guestListFile", maxCount: 1 },
  ]),
  finalizeAlbum
);

router.get("/:albumId", protect, getAlbumById); // הוסף את ה-middleware

router.get("/", protect, getAllAlbums);

export default router;
