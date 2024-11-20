import Album from "../models/albumModel.mjs";

export const checkAlbumLimit = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === "user") {
      const existingAlbum = await Album.findOne({ user: userId });
      if (existingAlbum) {
        return res
          .status(400)
          .json({ message: "Regular users can create only one album." });
      }
    }

    next(); // המשך אם אין אלבום או שהמשתמש אינו רגיל
  } catch (error) {
    console.error("Error checking user album limit:", error);
    res.status(500).json({ message: "Error checking album limit" });
  }
};
