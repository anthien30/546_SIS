import mongoose from "mongoose";
import { ICourse } from ".";

const courseSchema = new mongoose.Schema<ICourse>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  credits: {
    type: Number,
    required: true,
  },
  semester: {
    type: String, // e.g., 'Fall 2025'
    required: true,
  },
  schedule: {
    days: [String], // e.g., ['Monday', 'Wednesday']
    time: {
      start: String, // e.g., '10:00 AM'
      end: String, // e.g., '11:30 AM'
    },
  },
  prerequisites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to other courses
    },
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Reference to the Account entity with role 'faculty'
    default: null,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // Reference to the Account entity with role 'student'
    },
  ],
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
