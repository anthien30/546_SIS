import mongoose from "mongoose";

export interface IAccount extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  role: "Student" | "Faculty" | "Admin";
  createdOn: Date;
  createdBy: string | null;
}
