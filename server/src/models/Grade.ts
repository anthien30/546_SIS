import mongoose from "mongoose";
import { IGrade } from ".";

const gradeSchema = new mongoose.Schema<IGrade>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  //   instructor: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Account",
  //     required: true,
  //   },
  event: { type: String, required: true }, // "Quiz 1", "Midterm", "Final", etc.
  score: { type: Number, required: true }, // Numeric score
  maxScore: { type: Number, required: true }, // Maximum possible score
  //   weight: { type: Number, required: true }, // Percentage weight (optional for weighted grading)
  //   createdAt: { type: Date, default: Date.now },
});

const Grade = mongoose.model<IGrade>("Grade", gradeSchema);

export default Grade;
