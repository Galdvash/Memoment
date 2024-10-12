import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Phone = mongoose.model("Phone", phoneSchema);

export default Phone;
