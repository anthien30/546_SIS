import { Request, Response } from "express";
import { IGrade } from "../models";
import Grade from "../models/Grade";

export const createOrUpdateGrades = async (
  req: Request,
  res: Response
): Promise<any> => {
  const grades = req.body as IGrade[];

  if (!Array.isArray(grades) || grades.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input. Provide an array of grades." });
  }

  try {
    const bulkOps = grades.map((grade) => ({
      updateOne: {
        filter: {
          student: grade.student,
          schedule: grade.schedule,
          event: grade.event,
        }, // Identify existing grade
        update: { $set: { score: grade.score, maxScore: grade.maxScore } }, // Update fields
        upsert: true, // Insert if not found
      },
    }));

    const result = await Grade.bulkWrite(bulkOps);

    res.status(201).json({
      message: "Grades processed successfully",
      insertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGrade = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, student, schedule, score, maxScore, event } = req.body as IGrade;

  const existingGrade = await Grade.findById(id);

  if (!existingGrade)
    return res
      .status(400)
      .json({ message: "Grade record not found with the given id" });

  existingGrade.student = student;
  existingGrade.schedule = schedule;
  existingGrade.score = score;
  existingGrade.maxScore = maxScore;
  existingGrade.event = event;

  await existingGrade.save();

  res.status(200).json({ message: "Grade updated successfully" });
};

export const searchGrades = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { student, schedule, sortBy, sortOrder, limit } = req.query;

    const filters: any = {};
    if (student) filters.student = student;
    if (schedule) filters.schedule = schedule;
    // if (name) filters.name = { $regex: name, $options: "i" };
    // if (code) filters.code = { $regex: code, $options: "i" };
    // if (term) filters.term = term;
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
    let gradeQuery = Grade.find(filters).sort(sortOptions);
    // .populate("courses");
    if (limit) gradeQuery = gradeQuery.limit(limit as any);
    const grades = await gradeQuery;

    // Return the filtered accounts
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
