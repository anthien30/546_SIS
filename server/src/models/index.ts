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
  semester: string; // e.g., 'Fall 2025'
  schedule: {
    days: string[]; // e.g., ['Monday', 'Wednesday']
    time: {
      start: string; // e.g., '10:00 AM'
      end: string; // e.g., '11:30 AM'
    };
  };
  prerequisites: ObjectId[]; // Array of references to other courses
  instructor: ObjectId | null; // Reference to the Account entity with role 'faculty'
  enrolledStudents: ObjectId[]; // Array of references to Account entities with role 'student'
}
