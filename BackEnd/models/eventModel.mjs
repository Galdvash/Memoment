import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
