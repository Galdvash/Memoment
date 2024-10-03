// Import necessary modules
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import imageRoutes from "./routes/imageRoutes.mjs";
import selfieRoutes from "./routes/selfieRoutes.mjs";
import Image from "./models/imageModel.mjs"; // Event images model
import Selfie from "./models/selfieModel.mjs"; // Selfies model

// Initialize environment variables
dotenv.config();

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS Rekognition Client Setup
const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// POST: Upload Selfie and Match Faces
app.post(
  "/match-faces",
  upload.single("sourceImage"), // Ensure the source image is uploaded properly
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No source image uploaded");
      }

      // Log the received file for debugging
      console.log("Received file:", req.file);

      const sourceImageBuffer = req.file.buffer;

      // Fetch all event images from MongoDB
      const eventImages = await Image.find({ type: "event" });
      console.log(`Found ${eventImages.length} event images in the database.`);

      // Initialize an array to store matched images
      const matchedImages = [];

      // Loop through each event image and compare it with the uploaded selfie
      for (const eventImage of eventImages) {
        const targetImageBuffer = eventImage.data;

        // Prepare AWS Rekognition parameters for face comparison
        const params = {
          SourceImage: { Bytes: sourceImageBuffer },
          TargetImage: { Bytes: targetImageBuffer },
          SimilarityThreshold: 80, // הורדת סף ההתאמה ל-80
        };

        // Log the parameters being sent to AWS Rekognition
        console.log(`Comparing faces with event image: ${eventImage.filename}`);

        // Send the request to AWS Rekognition
        const compareFacesCommand = new CompareFacesCommand(params);
        const result = await rekognition.send(compareFacesCommand);

        // Log the full Rekognition result for debugging
        console.log("Rekognition result:", JSON.stringify(result, null, 2));

        // Check if the face matches the target image
        if (result.FaceMatches && result.FaceMatches.length > 0) {
          console.log(`Match found with image: ${eventImage.filename}`);
          matchedImages.push(eventImage.filename); // Store the filename of the matching event image
        } else {
          console.log(`No match found for image: ${eventImage.filename}`);
        }
      }

      // Log the matched images that were found
      console.log("Matched images:", matchedImages);

      // Return the list of matched images as the response
      res.status(200).json({ matchedImages });
    } catch (error) {
      console.error("Error matching faces:", error);
      res.status(500).send("Error matching faces");
    }
  }
);

// GET: Fetch Matched Images for the User
app.get("/matched-images/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Fetch the images where the user's face was matched
    const matchedImages = await Image.find({ filename: { $in: filename } });

    if (matchedImages.length === 0) {
      return res.status(404).json({ message: "No matched images found" });
    }

    res.status(200).json(matchedImages);
  } catch (error) {
    console.error("Error fetching matched images:", error);
    res.status(500).send("Error fetching matched images");
  }
});

// Use Routes for images and selfies
app.use("/api/images", imageRoutes);
app.use("/api/selfies", selfieRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
