import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/lms";

const promoteUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Use a generic schema for the update
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        
        const email = "shantokumar32@gmail.com";
        const result = await User.findOneAndUpdate(
            { email: email },
            { role: "admin" },
            { new: true }
        );

        if (result) {
            console.log(`Successfully promoted ${email} to admin!`);
        } else {
            console.log(`User with email ${email} NOT FOUND.`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error during promotion:", err);
        process.exit(1);
    }
};

promoteUser();
