import mongoose from "mongoose";
import { ISchedule } from ".";

const ScheduleSchema = new mongoose.Schema<ISchedule>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  days: [
    {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  ],
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  }, // Example: "Room 101, Engineering Building"
  maxEnrollment: {
    type: Number,
    default: 30,
  }, // Maximum students allowed
  enrolledStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Account",
  },
});

const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
