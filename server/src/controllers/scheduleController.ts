import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import { ISchedule } from "../models";

export const createSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { course, term, days, location, startTime, endTime } =
    req.body as ISchedule;

  const schedule = new Schedule({
    course,
    term,
    days,
    location,
    startTime,
    endTime,
  });

  await schedule.save();

  res.status(201).json({ message: "Schedule created successfully" });
};

export const searchSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { term, course, sortBy, sortOrder, limit } = req.query;

    const filters: any = {};
    // if (term) filters.term = { $regex: term, $options: "i" };
    // if (course) filters.course = { $regex: course, $options: "i" };
    if (term) filters.term = term;
    if (course) filters.course = course;
    // if (codeOrName)
    //   filters["$or"] = [
    //     { code: { $regex: codeOrName, $options: "i" } },
    //     { name: { $regex: codeOrName, $options: "i" } },
    //   ];
    // filters.isDeleted = { $ne: true };

    // Define sorting order, defaulting to ascending if not specified
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1; // Use -1 for descending, 1 for ascending
    }

    // Fetch accounts from the database with the applied filters and sorting
    let schedulesQuery = Schedule.find(filters)
      .sort(sortOptions)
      .populate("course");
    if (limit) schedulesQuery = schedulesQuery.limit(limit as any);
    const courses = await schedulesQuery;

    // Return the filtered accounts
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message ?? "Server error", error });
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, term, course, startTime, endTime, days, location } =
    req.body as ISchedule;

  const existingSchedule = await Schedule.findById(id);

  if (!existingSchedule)
    return res
      .status(400)
      .json({ message: "Schedule not found with the given id" });

  existingSchedule.term = term;
  existingSchedule.course = course;
  existingSchedule.days = days;
  existingSchedule.startTime = startTime;
  existingSchedule.endTime = endTime;
  existingSchedule.location = location;

  await existingSchedule.save();

  res.status(201).json({ message: "Schedule updated successfully" });
};

export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Schedule id is required" });

  const existingSchedule = await Schedule.findById(id);
  if (!existingSchedule)
    return res
      .status(400)
      .json({ message: "Schedule not found with the given id" });

  await Schedule.deleteOne({ _id: id });

  res.status(200).json({ message: "Schedule deleted" });
};
