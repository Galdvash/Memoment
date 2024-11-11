// routes/faceRoutes.mjs
import express from "express";
import { uploadFaceImage, matchFaces } from "../controllers/faceController.mjs";

const router = express.Router();

// Route for face recognition
router.post("/match-faces", uploadFaceImage.single("sourceImage"), matchFaces);

export default router;
