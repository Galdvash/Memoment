import { connectDB } from "./app.mjs"; // ייבוא הקובץ שמתחבר ל-MongoDB
import bcrypt from "bcryptjs";
import User from "./models/UserModel.mjs";

const createAdminUser = async () => {
  try {
    await connectDB(); // חיבור ל-MongoDB

    const plainPassword = "Admin123@";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isBusiness: false,
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser();
