import Image from "../models/imageModel.mjs";
import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({ storage });
export const uploadImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageDocs = files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
      userId,
      type: "event", // הוספת השדה 'type' לכל תמונה
    }));

    await Image.insertMany(imageDocs);

    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};

export const getImages = async (req, res) => {
  try {
    const userId = req.user.id; // מניח שהשתמשת ב-protect middleware כדי לקבל את userId
    const images = await Image.find({ userId }); // חיפוש לפי מזהה המשתמש המחובר
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
};
export const getImageByFilename = async (req, res) => {
  try {
    const image = await Image.findOne({ filename: req.params.filename });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.contentType(image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image" });
  }
};
