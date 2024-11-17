import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import dotenv from "dotenv";
import Album from "../models/albumModel.mjs";
dotenv.config();

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// פונקציה להעלאת סלפי
export const uploadSelfie = async (req, res) => {
  try {
    const { albumId, userId } = req.body;

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    if (!albumId || !userId) {
      return res.status(400).send("Missing albumId or userId.");
    }

    const existingSelfie = await Selfie.findOne({
      album: albumId,
      user: userId,
    });

    if (existingSelfie) {
      // עדכון סלפי קיים
      existingSelfie.filename = req.file.originalname;
      existingSelfie.data = req.file.buffer;
      existingSelfie.contentType = req.file.mimetype;
      await existingSelfie.save();

      return res.status(200).json({
        message: "Selfie updated successfully",
        filename: existingSelfie.filename,
      });
    }

    // יצירת סלפי חדש
    const selfie = new Selfie({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      album: albumId,
      user: userId,
    });

    await selfie.save();

    res.status(201).json({
      message: "Selfie uploaded successfully",
      filename: selfie.filename,
    });
  } catch (error) {
    console.error("Error uploading selfie:", error);
    res.status(500).send("Error uploading selfie.");
  }
};

// פונקציה לזיהוי פנים
export const matchFaces = async (req, res) => {
  try {
    const { albumId, userId } = req.body;

    // בדיקה אם כל הפרמטרים קיימים
    if (!req.file || !albumId || !userId) {
      console.error("Missing required parameters:", {
        file: !!req.file,
        albumId,
        userId,
      });
      return res.status(400).json({ message: "Missing required parameters." });
    }

    console.log("Processing face recognition for album:", albumId);

    const sourceImageBuffer = req.file.buffer;

    // שליפת האלבום מהמסד נתונים
    const album = await Album.findById(albumId);

    if (!album || !album.images || album.images.length === 0) {
      console.error("No images found in the album:", albumId);
      return res.status(404).json({ message: "No images found in the album." });
    }

    console.log(`Found ${album.images.length} images in album.`);

    const matchedImages = [];

    // לולאה על התמונות באלבום
    for (const image of album.images) {
      const params = {
        SourceImage: { Bytes: sourceImageBuffer },
        TargetImage: { Bytes: Buffer.from(image.data) }, // המר ל-Buffer
        SimilarityThreshold: 80,
      };

      console.log("Comparing faces for image:", image.filename);

      const command = new CompareFacesCommand(params);
      const result = await rekognitionClient.send(command);

      if (result.FaceMatches && result.FaceMatches.length > 0) {
        matchedImages.push({
          filename: image.filename,
          contentType: image.contentType,
          data: image.data.toString("base64"), // ממיר את הנתונים ל-Base64
        });
      }
    }

    console.log("Matched images:", matchedImages);

    res.status(200).json({ matchedImages });
  } catch (error) {
    console.error("Error during face recognition:", error.message);
    res.status(500).json({ message: "Error during face recognition." });
  }
};

export const deleteSelfie = async (req, res) => {
  try {
    const { filename } = req.params;

    const result = await Selfie.deleteOne({ filename });

    if (result.deletedCount === 0) {
      return res.status(404).send("Selfie not found.");
    }

    res.status(200).send("Selfie deleted successfully.");
  } catch (error) {
    console.error("Error deleting selfie:", error);
    res.status(500).send("Error deleting selfie.");
  }
};
