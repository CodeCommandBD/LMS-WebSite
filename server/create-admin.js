import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import "dotenv/config";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database...");

    const email = "shantokumar32@gmail.com";
    const password = "lol@Admin@11";
    
    // Check if user exists
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      console.log("Admin user already exists. Updating password and role...");
      adminUser.password = await bcrypt.hash(password, 10);
      adminUser.role = "admin";
      adminUser.isVerified = true;
      await adminUser.save();
    } else {
      console.log("Creating new admin user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      adminUser = new User({
        name: "Admin Shanto",
        email,
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });
      await adminUser.save();
    }

    console.log("✅ Admin account successfully created/updated!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
