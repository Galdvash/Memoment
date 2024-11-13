// controllers/userController.js

import User from "../models/UserModel.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../validation/userValidation.mjs";

export const registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, isBusiness } = req.body;

  try {
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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

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
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
