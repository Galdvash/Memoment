// routes/selfieRoutes.mjs
import express from "express";
import {
  upload,
  uploadSingleSelfie,
  getSelfieByFilename,
  deleteSelfieByFilename,
} from "../controllers/selfieController.mjs";

const router = express.Router();

// Route for uploading a selfie
router.post("/upload", upload.single("image"), uploadSingleSelfie);

// Route for fetching a selfie by filename
router.get("/:filename", getSelfieByFilename);

// Route for deleting a selfie by filename
router.delete("/:filename", deleteSelfieByFilename);

export default router;
