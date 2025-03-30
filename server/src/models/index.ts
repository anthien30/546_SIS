import mongoose, { mongo } from "mongoose";

export interface IAccount extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  role: "Student" | "Faculty" | "Admin";
  status: "Active" | "Inactive";
  createdOn: Date;
  createdBy: string | null;
}

export interface ICourse extends mongoose.Document {
  code: string;
  name: string;
  description?: string; // Optional field
  credits: number;
  isDeleted: boolean;
  prerequisites: mongoose.Types.ObjectId[]; // Array of references to other courses
  // enrolledStudents: mongoose.Types.ObjectId[]; // Array of references to Account entities with role 'student'
}

export interface ICurriculum extends mongoose.Document {
  name: string;
  // degreeType: string;
  // major: string;
  courses: string[];
  electives: string[];
  creditsRequired: number;
}

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export interface ISchedule extends mongoose.Document {
  course: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  term: string;
  days: Day[];
  startTime: string;
  endTime: string;
  location: string;
  maxEnrollment: number;
  enrolledStudents: mongoose.Types.ObjectId[];
}

export interface IGrade extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  event: string;
}

export interface IAcademicRecord extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  grade: number;
  schedule: mongoose.Types.ObjectId;
}
