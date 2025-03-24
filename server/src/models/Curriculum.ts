import mongoose from "mongoose";
import { ICurriculum } from ".";

const curriculumSchema = new mongoose.Schema<ICurriculum>({
  name: { type: String, required: true, unique: true }, // e.g., "Computer Science"
  // degreeType: { type: String, required: true }, // e.g., "Bachelor of Science"
  // major: { type: String, required: true }, // e.g., "Software Engineering"
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // List of required courses
  // electives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Optional electives
  creditsRequired: { type: Number, required: true }, // Total credits needed to complete
});

const Curriculum = mongoose.model<ICurriculum>("Curriculum", curriculumSchema);

export default Curriculum;
