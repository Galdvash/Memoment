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
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, isBusiness } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const role = isBusiness ? "business" : "user";

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// התחברות משתמש
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({ token, message: "Logged in successfully" });
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

// קבלת כל המשתמשים (רק למנהלים)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
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
