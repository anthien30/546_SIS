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

import { ObjectId } from "mongoose";

export interface ICourse extends mongoose.Document {
  code: string;
  name: string;
  description?: string; // Optional field
  credits: number;
  isDeleted: boolean;
  prerequisites: ObjectId[]; // Array of references to other courses
  // enrolledStudents: ObjectId[]; // Array of references to Account entities with role 'student'
}

export interface ICurriculum extends mongoose.Document {
  programName: string;
  degreeType: string;
  major: string;
  requiredCourses: string[];
  electives: string[];
  totalCreditsRequired: number;
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
  course: ObjectId;
  instructor: ObjectId;
  term: string;
  days: Day[];
  startTime: string;
  endTime: string;
  location: string;
  maxEnrollment: number;
}
