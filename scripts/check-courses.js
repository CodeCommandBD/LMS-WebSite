import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/lms";

const checkData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const Course = mongoose.model('Course', new mongoose.Schema({ creator: mongoose.Schema.Types.ObjectId }));
        const User = mongoose.model('User', new mongoose.Schema({ name: String }));

        const courses = await Course.find({}).limit(10);
        console.log(`Found ${courses.length} courses`);

        for (const course of courses) {
            console.log(`Course ID: ${course._id}, Creator Field: ${course.creator}`);
            if (course.creator) {
                const user = await User.findById(course.creator);
                console.log(`  -> User found: ${user ? user.name : "NOT FOUND"}`);
            } else {
                console.log(`  -> Creator is MISSING or NULL`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
