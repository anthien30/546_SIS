import mongoose from "mongoose";

const MeetingTimeSchema = new mongoose.Schema({
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
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
});

const ScheduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" }, // Assuming you have an Instructor model
  meetingTimes: [MeetingTimeSchema],
  location: { type: String }, // Example: "Room 101, Engineering Building"
});

const TermSchema = new mongoose.Schema({
  termId: { type: String, required: true, unique: true }, // Example: "Fall2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  schedules: [ScheduleSchema],
});

const Term = mongoose.model("Term", TermSchema);

export default Term;
