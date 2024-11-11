// selfieController.mjs
import multer from "multer";
import Selfie from "../models/selfieModel.mjs"; // Ensure the correct path

// Multer configuration for Selfie Upload
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Upload a single selfie to MongoDB
export const uploadSingleSelfie = async (req, res) => {
  try {
    // Check if the selfie already exists
    const existingSelfie = await Selfie.findOne({
      filename: req.file.originalname,
    });

    if (existingSelfie) {
      return res.status(400).json({
        message: "Selfie already exists. Please delete the existing one first.",
      });
    }

    const selfie = new Selfie({
      filename: req.file.originalname,
      data: req.file.buffer, // Binary image data
      contentType: req.file.mimetype,
    });

    await selfie.save();

    res.status(200).json({
      message: "Selfie uploaded successfully",
      filename: req.file.originalname, // Return the filename for retrieval
    });
  } catch (error) {
    console.error("Error uploading selfie:", error);
    res.status(500).send("Error uploading selfie");
  }
};

// Fetch a single selfie by filename from MongoDB
export const getSelfieByFilename = async (req, res) => {
  try {
    const selfie = await Selfie.findOne({ filename: req.params.filename });
    if (!selfie) {
      return res.status(404).send("Selfie not found");
    }
    res.contentType(selfie.contentType); // Set the content type to match the image format
    res.send(selfie.data); // Send the binary data (image)
  } catch (error) {
    console.error("Error fetching selfie:", error);
    res.status(500).send("Error fetching selfie");
  }
};

// Delete a selfie by filename from MongoDB
export const deleteSelfieByFilename = async (req, res) => {
  try {
    const selfie = await Selfie.findOneAndDelete({
      filename: req.params.filename,
    });
    if (!selfie) {
      return res.status(404).send("Selfie not found");
    }

    res.status(200).json({ message: "Selfie deleted successfully" });
  } catch (error) {
    console.error("Error deleting selfie:", error);
    res.status(500).send("Error deleting selfie");
  }
};
