import { Request, Response } from "express";
import { ICurriculum } from "../models";
import Curriculum from "../models/Curriculum";

export const createCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    programName,
    degreeType,
    major,
    requiredCourses,
    electives,
    totalCreditsRequired,
  } = req.body as ICurriculum;

  const curriculum = new Curriculum({
    programName,
    degreeType,
    major,
    requiredCourses,
    electives,
    totalCreditsRequired,
  });

  await curriculum.save();

  res.status(201).json({ message: "Curriculum created successfully" });
};
