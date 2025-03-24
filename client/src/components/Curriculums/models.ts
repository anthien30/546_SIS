import { Course } from "../Courses/models";

export interface Curriculum {
  name: string;
  courses: (Course | string)[];
  creditsRequired: number;
  _id: string;
}
