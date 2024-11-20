import mongoose from "mongoose";
import Album from "../models/albumModel.mjs";
import { processGuestList } from "../controllers/excelController.mjs";

export const createAlbum = async (req, res) => {
  try {
    const { eventName, location, date, eventType, isPrivate } = req.body;
    const userId = req.user._id;

    if (!eventName || !eventType || !location || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const guestListFile = req.files["guestListFile"]?.[0];
    let guestList = [];

    if (guestListFile) {
      try {
        guestList = processGuestList(guestListFile);
      } catch (err) {
        return res
          .status(400)
          .json({ message: `Error processing guest list: ${err.message}` });
      }
    }

    const coverImageFile = req.files["coverImage"]?.[0];
    const coverImage = coverImageFile
      ? {
          filename: coverImageFile.originalname,
          data: coverImageFile.buffer,
          contentType: coverImageFile.mimetype,
        }
      : null;

    const imagesFiles = req.files["images"] || [];
    const images = imagesFiles.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const newAlbum = new Album({
      user: userId,
      eventName,
      eventType,
      location,
      date,
      isPrivate: isPrivate === "true" || isPrivate === true,
      coverImage,
      guestListFile: guestListFile
        ? {
            filename: guestListFile.originalname,
            data: guestListFile.buffer,
            contentType: guestListFile.mimetype,
          }
        : null,
      numberOfGuests: guestList.length,
      images,
    });

    await newAlbum.save();

    res.status(201).json({
      message: "Album created successfully",
      albumId: newAlbum._id,
      numberOfGuests: guestList.length,
    });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Error creating album" });
  }
};

// controllers/albumController.mjs
export const getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;
    if (!albumId || !mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID" });
    }
    // עדכון ספירת הצפיות באלבום
    const album = await Album.findByIdAndUpdate(
      albumId,
      { $inc: { views: 1 } }, // הגדלת ערך views ב-1
      { new: true } // מחזיר את המסמך המעודכן
    ).lean();

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // המרת נתוני התמונות ל-base64
    if (album.coverImage && album.coverImage.data) {
      album.coverImage.data = album.coverImage.data.toString("base64");
    }

    if (album.images && album.images.length > 0) {
      album.images = album.images.map((image) => ({
        ...image,
        data: image.data.toString("base64"), // ודא שהנתונים מומרו ל-Base64
      }));
    }

    // המרת נתוני קובץ האקסל ל-base64
    if (album.guestListFile && album.guestListFile.data) {
      album.guestListFile.data = album.guestListFile.data.toString("base64");
    }

    res.status(200).json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ message: "Error fetching album" });
  }
};

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );

    const albumsWithImages = albums.map((album) => {
      const albumObj = album.toObject();

      if (albumObj.coverImage?.data) {
        albumObj.coverImage.data = albumObj.coverImage.data.toString("base64");
      }

      return albumObj;
    });

    res.status(200).json(albumsWithImages);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ message: "Error fetching albums" });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    if (!albumId) {
      return res.status(400).json({ message: "Album ID is required" });
    }

    const deletedAlbum = await Album.findByIdAndDelete(albumId);

    if (!deletedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ message: "Error deleting album" });
  }
};
export const updateAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;

    const existingAlbum = await Album.findById(albumId);
    if (!existingAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }

    const { eventName, location, date, eventType, isPrivate } = req.body;

    if (eventName) existingAlbum.eventName = eventName.trim();
    if (location) existingAlbum.location = location.trim();
    if (date) existingAlbum.date = date.trim();
    if (eventType) existingAlbum.eventType = eventType.trim();
    if (isPrivate !== undefined) existingAlbum.isPrivate = isPrivate;

    await existingAlbum.save();

    res.status(200).json({
      message: "Album updated successfully",
      album: existingAlbum,
    });
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).json({ message: "Error updating album" });
  }
};
export const addImagesToAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (!req.files || !Array.isArray(req.files)) {
      return res
        .status(400)
        .json({ message: "No images uploaded or incorrect format." });
    }

    const newImages = req.files.map((file) => ({
      filename: file.originalname,
      data: file.buffer.toString("base64"),
      contentType: file.mimetype,
    }));

    album.images.push(...newImages);
    await album.save();

    res.status(200).json({ message: "Images added successfully", album });
  } catch (error) {
    console.error("Error adding images to album:", error);
    res.status(500).json({ message: "Error adding images to album" });
  }
};
