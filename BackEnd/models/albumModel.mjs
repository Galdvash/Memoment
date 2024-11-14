// models/albumModel.mjs
import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["wedding", "party", "barMitzvah"],
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  coverImage: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  images: [
    {
      filename: String,
      data: Buffer,
      contentType: String,
    },
  ],
  guestListFile: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Album = mongoose.model("Album", albumSchema);
export default Album;
