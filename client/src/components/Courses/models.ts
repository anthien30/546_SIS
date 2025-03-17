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
  isDeleted: boolean;
  prerequisites: (string | Course)[];
}
