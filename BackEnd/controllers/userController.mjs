// controllers/userController.js

import User from "../models/UserModel.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../validation/userValidation.mjs";

export const registerUser = async (req, res) => {
  // ולידציה עם Joi
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, isBusiness } = req.body; // הוספתי את 'name'

  try {
    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // קביעת התפקיד על בסיס isBusiness
    const role = isBusiness ? "business" : "user";

    // יצירת משתמש חדש כולל השם
    const user = new User({
      name, // הוספתי את השם
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // יצירת טוקן JWT הכולל את ה-role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // שליחת הטוקן ב-HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // הגדר ל-true בפרודקשן עם HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ימים
      sameSite: "Lax",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res
          .status(400)
          .json({ message: "User already logged in with an active session" });
      }
    } catch (error) {
      // הטוקן אינו תקף, ממשיכים בתהליך התחברות
    }
  }

  const { email, password } = req.body;

  try {
    // בדיקה אם המשתמש קיים
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // בדיקת הסיסמה
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // יצירת טוקן JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // שליחת הטוקן ב-HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    // המידע על המשתמש נמצא ב-req.user מ-Middleware של האימות
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
