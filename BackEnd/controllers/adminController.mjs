import User from "../models/UserModel.mjs";
import Album from "../models/albumModel.mjs"; // נתיב מתאים למיקום של המודל

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // עדכון השדות
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
// פונקציה ליצירת אדמין

// פונקציה לשליפת כל המשתמשים
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // לא להחזיר את הסיסמה
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserAlbums = async (req, res) => {
  const { userId } = req.params;

  try {
    const albums = await Album.find({ user: userId }).populate(
      "user",
      "name email"
    );
    if (!albums.length) {
      return res
        .status(404)
        .json({ message: "No albums found for this user." });
    }
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching user albums:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching user albums", error: error.message });
  }
};
