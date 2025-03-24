import { Request, Response } from "express";
import { ICurriculum } from "../models";
import Curriculum from "../models/Curriculum";

export const createCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, courses, electives, creditsRequired } = req.body as ICurriculum;

  const curriculum = new Curriculum({
    name,
    courses,
    electives,
    creditsRequired,
  });

  await curriculum.save();

  res.status(201).json({ message: "Curriculum created successfully" });
};

export const searchCurriculums = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { sortBy, sortOrder, limit } = req.query;

    const filters: any = {};
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
    let curriculumsQuery = Curriculum.find(filters)
      .sort(sortOptions)
      .populate("courses");
    if (limit) curriculumsQuery = curriculumsQuery.limit(limit as any);
    const courses = await curriculumsQuery;

    // Return the filtered accounts
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, name, courses, creditsRequired } = req.body as ICurriculum;

  const existingCurriculum = await Curriculum.findById(id);

  if (!existingCurriculum)
    return res
      .status(400)
      .json({ message: "Curriculum not found with the given id" });

  existingCurriculum.name = name;
  existingCurriculum.creditsRequired = creditsRequired;
  existingCurriculum.courses = courses;

  await existingCurriculum.save();

  res.status(201).json({ message: "Curriculum updated successfully" });
};

export const deleteCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.query;

  if (!id)
    return res.status(400).json({ message: "Curriculum id is required" });

  const existingCurriculum = await Curriculum.findById(id);
  if (!existingCurriculum)
    return res
      .status(400)
      .json({ message: "Curriculum not found with the given id" });

  await Curriculum.deleteOne({ _id: id });

  res.status(200).json({ message: "Curriculum deleted" });
};
