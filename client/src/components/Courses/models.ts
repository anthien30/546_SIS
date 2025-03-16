export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Course {
  _id: string;
  id: string | null;
  code: string | null;
  name: string | null;
  description: string | null;
  credits: number;
  semester: string | null;
  schedule: {
    days: Day[];
    time: {
      start: string; // e.g., '10:00 AM'
      end: string; // e.g., '11:30 AM'
    };
  };
  prerequisites: (string | Course)[];
  instructor: string;
  enrolledStudents: string[];
}
