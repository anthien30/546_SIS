import { Request, Response } from "express";
import { ICourse, ISchedule } from "../models";
import Course from "../models/Course";
import Account from "../models/Account";
import AcademicRecord from "../models/AcademicRecord";

export const createCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { code, name, credits, description, prerequisites } =
    req.body as ICourse;

  const course = new Course({
    code,
    name,
    credits,
    description,
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
    const { code, name, term, codeOrName, sortBy, sortOrder, limit } =
      req.query;

    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (code) filters.code = { $regex: code, $options: "i" };
    if (term) filters.term = term;
    if (codeOrName)
      filters["$or"] = [
        { code: { $regex: codeOrName, $options: "i" } },
        { name: { $regex: codeOrName, $options: "i" } },
      ];
    filters.isDeleted = { $ne: true };

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

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    id,
    // code,
    // name,
    credits,
    description,
    prerequisites,
  } = req.body as ICourse;

  const existingCourse = await Course.findById(id);

  if (!existingCourse)
    return res
      .status(400)
      .json({ message: "Course not found with the given id" });

  existingCourse.credits = credits;
  // existingCourse.instructor = instructor;
  existingCourse.description = description;
  // existingCourse.term = term;
  existingCourse.prerequisites = prerequisites;
  // existingCourse.code = code;
  // existingCourse.name = name;

  await existingCourse.save();

  res.status(201).json({ message: "Course updated successfully" });
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Course id is required" });

  const existingCourse = await Course.findById(id);
  if (!existingCourse)
    return res
      .status(400)
      .json({ message: "Course not found with the given id" });

  await Course.deleteOne({ _id: id });

  res.status(200).json({ message: "Course deleted" });
};

export const getCourseEligibility = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { courseId, studentId } = req.query;

  const course = await Course.findById(courseId);
  if (!course)
    return res
      .status(400)
      .json({ message: "Course not found with the given id" });

  const student = await Account.findById(studentId);
  if (!student)
    return res
      .status(400)
      .json({ message: "Student account not found with the given id" });

  const filters: any = {};
  filters.student = studentId;
  const passedCourses = (
    await AcademicRecord.find(filters).populate("schedule")
  )
    ?.filter((r) => r.grade >= 80)
    ?.map((c) => (c.schedule as unknown as ISchedule).course.toString());

  res.status(200).json({
    isEligible: (course as ICourse).prerequisites.every((p) =>
      passedCourses.includes(p.toString())
    ),
  });
};
