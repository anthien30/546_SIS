import { Request, Response } from "express";
import AcademicRecord from "../models/AcademicRecord";
import { IAcademicRecord } from "../models";

export const createOrUpdateAcademicRecord = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { student, schedule, grade, _id } = req.body as IAcademicRecord;

  if (_id) {
    let existingRecord = await AcademicRecord.findById(_id);
    if (!existingRecord)
      return res
        .status(400)
        .json({ message: "Record not found with the given id" });

    existingRecord.grade = grade;

    await existingRecord.save();

    return res.status(200).json({ message: "Record updated successfully" });
  }

  const record = new AcademicRecord({
    student,
    schedule,
    grade,
  });

  await record.save();

  res.status(201).json({ message: "Record created successfully" });
};

export const searchFinalGrades = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { student, schedule, sortBy, sortOrder, limit } = req.query;

    const filters: any = {};
    if (student) filters.student = student;
    if (schedule) filters.schedule = schedule;

    // Define sorting order, defaulting to ascending if not specified
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1; // Use -1 for descending, 1 for ascending
    }

    // Fetch accounts from the database with the applied filters and sorting
    let recordQuery = AcademicRecord.find(filters).sort(sortOptions);
    // .populate("courses");
    if (limit) recordQuery = recordQuery.limit(limit as any);
    const records = await recordQuery;

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
