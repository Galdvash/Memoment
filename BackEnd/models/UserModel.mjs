// models/UserModel.mjs
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["user", "business", "admin"], // רק תפקידים
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now, // הוספת חותמת זמן אוטומטית
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
