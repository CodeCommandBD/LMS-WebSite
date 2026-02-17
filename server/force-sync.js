import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Purchase from "./models/purchase.model.js";
import Course from "./models/course.model.js";

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    const purchases = await Purchase.find();
    console.log(`Found ${purchases.length} total purchase records`);

    for (const p of purchases) {
      console.log(
        `Processing purchase ${p._id}: User ${p.userId}, Course ${p.courseId}, Status ${p.status}`,
      );

      const user = await User.findById(p.userId);
      if (!user) {
        console.log(` - User ${p.userId} not found`);
        continue;
      }

      const isAlreadyEnrolled = user.enrolledCourses.some(
        (id) => id.toString() === p.courseId.toString(),
      );

      if (!isAlreadyEnrolled) {
        console.log(` - User ${user.email} not enrolled. Syncing...`);
        user.enrolledCourses.push(p.courseId);
        await user.save();

        const course = await Course.findById(p.courseId);
        if (
          course &&
          !course.enrolledStudents.some(
            (id) => id.toString() === user._id.toString(),
          )
        ) {
          course.enrolledStudents.push(user._id);
          await course.save();
        }

        p.status = "completed";
        await p.save();
        console.log(" - Fulfillment completed!");
      } else {
        console.log(" - User already enrolled.");
      }
    }

    console.log("Sync complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error during sync:", err);
    process.exit(1);
  }
};

run();
