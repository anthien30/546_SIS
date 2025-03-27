import express from "express";
import {
  createOrUpdateGrades,
  searchGrades,
  updateGrade,
} from "../controllers/gradeController";

const router = express.Router();

router.post("/createOrUpdate", createOrUpdateGrades);
router.post("/update", updateGrade);
router.get("/search", searchGrades);

export default router;
