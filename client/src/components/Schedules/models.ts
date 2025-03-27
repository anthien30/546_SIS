import { Account } from "../AccountsManagement/models";
import { Course } from "../Courses/models";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export interface Schedule {
  _id: string;
  id: string | null;
  course: string | Course | null;
  instructor: string | Account | null;
  term: string | null;
  days: Day[];
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  maxEnrollment: number;
  enrolledStudents: (string | Account)[];
}

export interface Grade {
  _id?: string | null;
  student: Account | string;
  schedule: Schedule | string;
  score: number | null;
  maxScore: number | null;
  event: string | null;
}
