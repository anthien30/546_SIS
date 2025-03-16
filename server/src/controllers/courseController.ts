import { Request, Response } from "express";
import { ICourse } from "../models";
import Course from "../models/Course";
import Account from "../models/Account";

export const createCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { code, name, credits, semester, instructor, prerequisites } =
    req.body as ICourse;

  // const instructorRecord = await Account.findById(instructor);
  // if (!instructorRecord || instructorRecord.role !== "Faculty") {
  //   res.status(400).json({ message: "Invalid instructor id" });
  // }

  const course = new Course({
    code,
    name,
    credits,
    semester,
    instructor,
    prerequisites,
  });

  await course.save();

  res.status(201).json({ message: "Course registered successfully" });
};

export const searchCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { code, name, semester, codeOrName, sortBy, sortOrder, limit } =
      req.query;

    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (code) filters.code = { $regex: code, $options: "i" };
    if (semester) filters.semester = semester;
    if (codeOrName)
      filters["$or"] = [
        { code: { $regex: codeOrName, $options: "i" } },
        { name: { $regex: codeOrName, $options: "i" } },
      ];

    // Define sorting order, defaulting to ascending if not specified
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1; // Use -1 for descending, 1 for ascending
    }

    // Fetch accounts from the database with the applied filters and sorting
    let coursesQuery = Course.find(filters)
      .sort(sortOptions)
      .populate("prerequisites");
    if (limit) coursesQuery = coursesQuery.limit(limit as any);
    const courses = await coursesQuery;

    // Return the filtered accounts
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
