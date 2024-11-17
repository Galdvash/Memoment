import Album from "../models/albumModel.mjs";

export const createAlbum = async (req, res) => {
  try {
    const { eventName, location, date, eventType, isPrivate } = req.body;
    const userId = req.user._id;

    // בדיקת שדות נדרשים
    if (!eventName || !eventType || !location || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // עיבוד קובץ coverImage (אם קיים)
    const coverImageFile = req.files["coverImage"]?.[0];
    const coverImage = coverImageFile
      ? {
          filename: coverImageFile.originalname,
          data: coverImageFile.buffer,
          contentType: coverImageFile.mimetype,
        }
      : null;

    // עיבוד קובץ guestListFile (אם קיים)
    const guestListFile = req.files["guestListFile"]?.[0];
    const guestList = guestListFile
      ? {
          filename: guestListFile.originalname,
          data: guestListFile.buffer,
          contentType: guestListFile.mimetype,
        }
      : null;

    // עיבוד תמונות (אם קיימות)
    const imagesFiles = req.files["images"] || [];
    const images = imagesFiles.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    // יצירת האלבום
    const newAlbum = new Album({
      user: userId,
      eventName,
      eventType,
      location,
      date,
      isPrivate: isPrivate === "true" || isPrivate === true,
      coverImage,
      guestListFile: guestList,
      images,
    });

    // שמירת האלבום
    await newAlbum.save();

    res
      .status(201)
      .json({ message: "Album created successfully", albumId: newAlbum._id });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Error creating album" });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;

    // חיפוש אלבום לפי מזהה
    const album = await Album.findById(albumId)
      .populate("user", "name email") // הוספת שדה יוזר
      .lean();

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
        data: image.data.toString("base64"),
      }));
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
