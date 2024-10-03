// models/imageModel.mjs
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String, // 'image/jpeg' או 'image/png'
  type: {
    type: String,
    enum: ["event"], // ודא שאתה משתמש בערכים נכונים
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Image", imageSchema);
