// app.mjs
import express from "express";
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
app.use("/api/events", twilioRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/events", eventRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
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
