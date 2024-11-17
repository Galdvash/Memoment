import mongoose from "mongoose";

const selfieSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Selfie = mongoose.model("Selfie", selfieSchema);

export default Selfie;
