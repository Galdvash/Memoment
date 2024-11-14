// controllers/albumController.mjs
import Album from "../models/albumModel.mjs";

export const finalizeAlbum = async (req, res) => {
  try {
    const { eventName, location, date, eventType, isPrivate } = req.body;

    // לוגים לבדיקה
    console.log("Finalizing Album with the following data:");
    console.log("eventName:", eventName);
    console.log("location:", location);
    console.log("date:", date);
    console.log("eventType:", eventType);
    console.log("isPrivate:", isPrivate);
    console.log("Files:", req.files);

    // אימות שדות נדרשים
    if (!eventName || !location || !date || !eventType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // עיבוד הקבצים
    const coverImageFile = req.files["coverImage"]
      ? req.files["coverImage"][0]
      : null;
    const guestListFile = req.files["guestListFile"]
      ? req.files["guestListFile"][0]
      : null;
    const imagesFiles = req.files["images"] || [];

    // יצירת אובייקט האלבום
    const album = new Album({
      eventName,
      location,
      date: new Date(date),
      eventType,
      isPrivate: isPrivate === "true" || isPrivate === true, // טיפול ב-boolean
    });

    // הוספת תמונת כיסוי אם קיימת
    if (coverImageFile) {
      album.coverImage = {
        filename: coverImageFile.originalname,
        data: coverImageFile.buffer,
        contentType: coverImageFile.mimetype,
      };
    }

    // הוספת קובץ אקסל אם קיים
    if (guestListFile) {
      album.guestListFile = {
        filename: guestListFile.originalname,
        data: guestListFile.buffer,
        contentType: guestListFile.mimetype,
      };
    }

    // הוספת תמונות נוספות אם קיימות
    if (imagesFiles.length > 0) {
      album.images = imagesFiles.map((file) => ({
        filename: file.originalname,
        data: file.buffer,
        contentType: file.mimetype,
      }));
    }

    // שמירת האלבום ב-MongoDB
    await album.save();

    res
      .status(201)
      .json({ message: "Album created successfully", albumId: album._id });
  } catch (error) {
    console.error("Error finalizing album:", error);
    res.status(500).json({ message: "Error finalizing album" });
  }
};
export const getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // המרת נתוני Buffer ל-base64
    const albumObj = album.toObject();
    if (albumObj.coverImage && albumObj.coverImage.data) {
      albumObj.coverImage.data = albumObj.coverImage.data.toString("base64");
    }
    if (albumObj.guestListFile && albumObj.guestListFile.data) {
      albumObj.guestListFile.data =
        albumObj.guestListFile.data.toString("base64");
    }
    if (albumObj.images && albumObj.images.length > 0) {
      albumObj.images = albumObj.images.map((image) => ({
        ...image,
        data: image.data.toString("base64"),
      }));
    }

    res.status(200).json(albumObj);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ message: "Error fetching album" });
  }
};
