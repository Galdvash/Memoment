// app.mjs
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
import selfieRoutes from "./routes/selfieRoutes.mjs";
import excelRoutes from "./routes/excelRoutes.mjs";
import twilioRoutes from "./routes/twilioRoutes.mjs";
import albumRoutes from "./routes/albumRoutes.mjs";
import eventRoutes from "./routes/eventRoutes.mjs";
import bodyParser from "body-parser";
import morganMiddleware from "./middleware/morganMiddleware.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

dotenv.config();

const app = express();

// הגדרת CORS דינמי
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://memoment.netlify.app"
      : "http://localhost:3000",
  credentials: true, // נחוץ במידה ותשוב לשימוש ב-cookies בעתיד
};
app.use(morganMiddleware); // מורגן לוגינג
// app.use(express.json({ limit: "50mb" }))
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// חיבור דינמי ל-MongoDB
const connectDB = async () => {
  try {
    const dbUri =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_ATLAS
        : process.env.MONGODB_URI_LOCAL;
    await mongoose.connect(dbUri);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

connectDB();
// בסיס למענה ראשוני
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/selfies", selfieRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/events", eventRoutes);
app.use(errorHandler);
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ message: "Payload too large. Please upload smaller files." });
  }
  console.error(err);
  res.status(500).json({ message: "An unexpected error occurred." });
});

// Handle undefined routes

// Global error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Environment: ${
      process.env.NODE_ENV === "production" ? "Production" : "Development"
    }`
  );
});
