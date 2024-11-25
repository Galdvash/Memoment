import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  eventType: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
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
  numberOfGuests: {
    type: Number,
    default: 0,
  },
  views: { type: Number, default: 0 }, // הוספת שדה עם ברירת מחדל

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Album = mongoose.model("Album", albumSchema);
export default Album;
