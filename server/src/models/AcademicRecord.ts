import mongoose from "mongoose";
import { IAcademicRecord } from ".";

const academicRecordSchema = new mongoose.Schema<IAcademicRecord>({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  grade: { type: Number, required: true },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
});

const AcademicRecord = mongoose.model<IAcademicRecord>(
  "AcademicRecord",
  academicRecordSchema
);

export default AcademicRecord;
