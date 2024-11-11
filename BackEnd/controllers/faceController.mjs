// controllers/faceController.mjs
import multer from "multer";
import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import Image from "../models/imageModel.mjs";
import dotenv from "dotenv";

dotenv.config();

// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
export const uploadFaceImage = multer({ storage });

// AWS Rekognition Client Setup
const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Controller function for face recognition
export const matchFaces = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No source image uploaded");
    }

    const sourceImageBuffer = req.file.buffer;

    // Fetch all event images from MongoDB
    const eventImages = await Image.find({ type: "event" });
    console.log(`Found ${eventImages.length} event images in the database.`);

    const matchedImages = [];

    // Compare each event image with the uploaded source image using AWS Rekognition
    for (const eventImage of eventImages) {
      const targetImageBuffer = eventImage.data;

      const params = {
        SourceImage: { Bytes: sourceImageBuffer },
        TargetImage: { Bytes: targetImageBuffer },
        SimilarityThreshold: 80, // Adjust the similarity threshold as needed
      };

      const compareFacesCommand = new CompareFacesCommand(params);
      const result = await rekognition.send(compareFacesCommand);

      if (result.FaceMatches && result.FaceMatches.length > 0) {
        matchedImages.push(eventImage.filename); // Add matched image filenames to the array
      }
    }

    res.status(200).json({ matchedImages });
  } catch (error) {
    console.error("Error matching faces:", error);
    res.status(500).send("Error matching faces");
  }
};
