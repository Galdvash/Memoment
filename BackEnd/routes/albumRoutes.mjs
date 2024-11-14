// routes/albumRoutes.mjs
import express from "express";
import {
  finalizeAlbum,
  getAlbumById,
} from "../controllers/albumController.mjs";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to finalize album creation with all data
router.post(
  "/finalize",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "guestListFile", maxCount: 1 },
  ]),
  finalizeAlbum
);

// Route to get album by ID
router.get("/:albumId", getAlbumById);

export default router;
