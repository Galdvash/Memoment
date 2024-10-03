import express from "express";
import {
  uploadSelfie,
  uploadSingleSelfie,
  getSelfieByFilename,
  deleteSelfieByFilename, // Import the delete controller
} from "../controllers/selfieController.mjs";

const router = express.Router();

// Route for uploading a selfie
router.post("/upload", uploadSelfie.single("image"), uploadSingleSelfie);

// Route for fetching a selfie by filename
router.get("/:filename", getSelfieByFilename);

// Route for deleting a selfie by filename
router.delete("/:filename", deleteSelfieByFilename); // New delete route

export default router;
