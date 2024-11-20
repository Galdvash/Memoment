// controllers/userController.mjs
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../validation/userValidation.mjs";

// פונקציה ליצירת טוקן
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// רישום משתמש חדש
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    // בדיקות לשדות חובה
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // בדיקת פורמט המספר
    if (!/^0\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // בדיקת תקינות role (אם לא נשלח, נשתמש בברירת מחדל "user")
    const validRoles = ["user", "business", "admin"];
    const userRole = role && validRoles.includes(role) ? role : "user";

    // בדיקה אם האימייל כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // בדיקה אם מספר הטלפון כבר קיים
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // יצירת סיסמה מוצפנת
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // יצירת משתמש חדש
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: userRole, // תפקיד המשתמש
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// התחברות משתמש
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // בדיקת שדות חובה
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // חיפוש משתמש לפי אימייל
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // אימות סיסמה
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // יצירת טוקן
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ token });
});

// התנתקות משתמש
export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// קבלת פרטי המשתמש הנוכחי
export const getMe = asyncHandler(async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({ message: "Visitor access - no user data" });
  }
});

// עדכון אימייל המשתמש
export const updateEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // בדיקה אם האימייל כבר קיים
  const emailExists = await User.findOne({ email });
  if (emailExists && emailExists._id.toString() !== req.user.id) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.findById(req.user.id);
  if (user) {
    user.email = email;
    const updatedUser = await user.save();

    const token = generateToken(updatedUser._id, updatedUser.role);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token,
      message: "Email updated successfully",
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// עדכון סיסמת המשתמש
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new passwords are required" });
  }

  const user = await User.findById(req.user.id);
  if (user) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
export const updateName = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({
      message: "Name is required and must be at least 2 characters long",
    });
  }

  const user = await User.findById(req.user.id);
  if (user) {
    user.name = name;
    const updatedUser = await user.save();

    const token = generateToken(updatedUser._id, updatedUser.role);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token,
      message: "Name updated successfully",
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
export const verifyPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await User.findById(req.user.id);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({ message: "Password verified successfully" });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// איפוס סיסמה
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  console.log("Received resetToken:", resetToken);
  console.log("Received newPassword:", newPassword);

  try {
    // מציאת המשתמש עם הטוקן והתוקף
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired reset token");
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // האשטת הסיסמה החדשה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // עדכון הסיסמה והסרת הטוקן
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log("Password updated successfully for user:", user.email);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});
export const addPhoneNumber = async (req, res) => {
  const { userId, phoneNumber } = req.body;

  try {
    // בדיקת פורמט מספר טלפון - ווידוא שהוא רק מכיל ספרות
    if (!phoneNumber.match(/^\d+$/)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // המרת מספר הטלפון לפורמט E.164 (למשל: +972523637089)
    const formatPhoneNumberToE164 = (phoneNumber) => {
      if (phoneNumber.startsWith("0")) {
        return `+972${phoneNumber.slice(1)}`; // הוספת קידומת בינלאומית לישראל
      }
      return phoneNumber; // אם המספר כבר בפורמט בינלאומי
    };
    // חיפוש משתמש לפי ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // בדיקה אם מספר הטלפון כבר בשימוש על ידי משתמש אחר
    const existingUser = await User.findOne({
      phoneNumber: formattedPhoneNumber,
    });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Phone number already associated with another user" });
    }

    // עדכון מספר הטלפון ביוזר
    user.phoneNumber = formattedPhoneNumber;
    await user.save();

    res.status(200).json({ message: "Phone number added successfully" });
  } catch (error) {
    console.error("Error adding phone number:", error);
    res.status(500).json({ message: "Server error" });
  }
};
