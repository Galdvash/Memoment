import Image from "../models/imageModel.mjs";
import multer from "multer";

// Multer Configuration
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImages = async (req, res) => {
  try {
    const files = req.files; // assuming multiple file upload

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageDocs = files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
      type: "event", // הוסף את השדה type עם הערך "event"
    }));

    await Image.insertMany(imageDocs);

    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};

// Fetch all images from MongoDB
export const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
};

// Fetch a single image by filename from MongoDB
export const getImageByFilename = async (req, res) => {
  try {
    const image = await Image.findOne({ filename: req.params.filename });
    if (!image) {
      return res.status(404).send("Image not found");
    }
    res.contentType(image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
};
