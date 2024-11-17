// routes/selfieRoutes.mjs
import express from "express";
import multer from "multer";
import {
  uploadSelfie,
  matchFaces,
  deleteSelfie,
} from "../controllers/selfieController.mjs";
import Selfie from "../models/selfieModel.mjs";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("sourceImage"), uploadSelfie);
router.delete("/:filename", deleteSelfie);
router.post("/match-faces", upload.single("sourceImage"), matchFaces);
// נתיב להחזרת תמונה לפי שם קובץ
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // שימוש במודל Selfie
    const selfie = await Selfie.findOne({ filename });

    if (!selfie) {
      return res.status(404).json({ message: "Selfie not found." });
    }

    res.set("Content-Type", selfie.contentType);
    res.send(selfie.data);
  } catch (error) {
    console.error("Error fetching selfie:", error);
    res.status(500).json({ message: "Error fetching selfie." });
  }
});

export default router;
