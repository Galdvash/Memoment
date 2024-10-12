import express from "express";
import { upload, matchFaces } from "../controllers/faceController.mjs";

const router = express.Router();

// Route for uploading a selfie and performing face recognition
router.post("/match-faces", upload.single("sourceImage"), matchFaces);

export default router;
