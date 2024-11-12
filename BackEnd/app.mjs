// app.mjs
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
import selfieRoutes from "./routes/selfieRoutes.mjs";
import faceRoutes from "./routes/faceRoutes.mjs"; // ייבוא נכון
import excelRoutes from "./routes/excelRoutes.mjs";
import twilioRoutes from "./routes/twilioRoutes.mjs";

// Load environment variables based on NODE_ENV
const currentEnv = process.env.NODE_ENV || "development";
dotenv.config({
  path: currentEnv === "production" ? ".env.production" : ".env.development",
});

const app = express();

const corsOptions = {
  origin:
    currentEnv === "production"
      ? "https://memoment.netlify.app"
      : "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const dbUri =
      process.env.NODE_ENV === "development"
        ? process.env.MONGODB_URI
        : process.env.MONGODB_URI_ATLAS;
    await mongoose.connect(dbUri);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

connectDB();

// Base route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/selfies", selfieRoutes);
app.use("/api/face", faceRoutes); // שימוש נכון ב-faceRoutes
app.use("/api/excel", excelRoutes);
app.use("/api/events", twilioRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Environment: ${currentEnv === "production" ? "Production" : "Development"}`
  );
});
