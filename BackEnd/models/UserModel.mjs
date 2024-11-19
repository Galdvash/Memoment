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
  phoneNumber: {
    type: String,
    unique: true, // לוודא שאין כפילויות
    sparse: true, // מאפשר למספרי טלפון להיות null
    validate: {
      validator: function (v) {
        return /^0\d{9}$/.test(v); // בדיקה לוודא שזה מספר טלפון ישראלי
      },
      message: "Invalid phone number format",
    },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: {
    type: String,
    enum: ["user", "business", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
