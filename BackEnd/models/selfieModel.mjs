// backend/models/selfieModel.mjs
import mongoose from "mongoose";

const selfieSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String, // 'image/jpeg' or 'image/png'
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Selfie", selfieSchema);
