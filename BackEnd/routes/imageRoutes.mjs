// imageRoutes.mjs

import express from "express";
import {
  upload,
  uploadImages,
  getImages,
  getImageByFilename,
} from "../controllers/imageController.mjs";

const router = express.Router();

// Route for uploading images
router.post("/upload", upload.array("images"), uploadImages);

// Route for fetching all images
router.get("/", getImages);

// Route for fetching a single image by filename
router.get("/:filename", getImageByFilename);

export default router;
