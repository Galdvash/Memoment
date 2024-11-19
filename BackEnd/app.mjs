import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morganMiddleware from "./middleware/morganMiddleware.mjs";
import routes from "./routes/index.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// הגדרת CORS דינמי
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://memoment.netlify.app"
      : "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// הפעלת CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // התמודדות עם preflight requests

// הפעלת Morgan Middleware
app.use(morganMiddleware);

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// חיבור ל-MongoDB
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

// Routes
app.use("/api", routes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

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
