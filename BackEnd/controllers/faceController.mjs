// backend/controllers/faceController.mjs
import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import Album from "../models/albumModel.mjs";
import dotenv from "dotenv";
import Selfie from "../models/selfieModel.mjs";

dotenv.config();

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export const matchFaces = async (req, res) => {
  try {
    const { albumId, userId } = req.params;

    if (!req.file || !albumId || !userId) {
      return res
        .status(400)
        .send("No source image uploaded, albumId or userId missing");
    }

    const sourceImageBuffer = req.file.buffer;

    const album = await Album.findOne({ _id: albumId, user: userId }).populate(
      "images"
    );
    if (!album) {
      return res
        .status(404)
        .send("Album not found or does not belong to the user");
    }

    const eventImages = album.images;

    const matchedImages = [];

    // השווה את התמונה המקורית עם כל תמונה באלבום
    for (const eventImage of eventImages) {
      const targetImageBuffer = eventImage.data;

      const params = {
        SourceImage: { Bytes: sourceImageBuffer },
        TargetImage: { Bytes: targetImageBuffer },
        SimilarityThreshold: 80,
      };

      const compareFacesCommand = new CompareFacesCommand(params);
      const result = await rekognition.send(compareFacesCommand);

      if (result.FaceMatches && result.FaceMatches.length > 0) {
        matchedImages.push(eventImage.filename);
      }
    }

    const selfie = await Selfie.findOne({ album: albumId, user: userId });
    if (selfie) {
      selfie.matchedImages = matchedImages;
      await selfie.save();
    } else {
      return res.status(404).send("Selfie not found for the user and album");
    }

    res.status(200).json({ matchedImages });
    console.log("Matched images sent to client:", matchedImages);
  } catch (error) {
    console.error("Error matching faces:", error);
    res.status(500).send("Error matching faces");
  }
};
