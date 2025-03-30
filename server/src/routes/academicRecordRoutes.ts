import express from "express";
import {
  createOrUpdateAcademicRecord,
  searchFinalGrades,
} from "../controllers/academicRecordController";

const router = express.Router();

router.post("/createOrUpdate", createOrUpdateAcademicRecord);
router.get("/search", searchFinalGrades);

export default router;
