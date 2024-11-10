import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
import selfieRoutes from "./routes/selfieRoutes.mjs";
import faceRoutes from "./routes/faceRoutes.mjs";
import excelRoutes from "./routes/excelRoutes.mjs";
import twilioRoutes from "./routes/twilioRoutes.mjs";

// הגדרת NODE_ENV לברירת מחדל אם הוא לא מוגדר
const currentEnv = process.env.NODE_ENV || "development";

dotenv.config({
  path: currentEnv === "production" ? "production.env" : "development.env",
});

const app = express();

console.log(`Running in ${currentEnv} mode`);

const corsOptions = {
  origin:
    currentEnv === "production"
      ? "https://memoment.netlify.app"
      : "http://localhost:3000",
  credentials: true,
};
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

connectDB();

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/selfies", selfieRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/events", twilioRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
