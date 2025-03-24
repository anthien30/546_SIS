import express from "express";
import {
  createCurriculum,
  deleteCurriculum,
  searchCurriculums,
  updateCurriculum,
} from "../controllers/curriculumController";

const router = express.Router();

router.post("/create", createCurriculum);
router.get("/search", searchCurriculums);
router.post("/update", updateCurriculum);
router.delete("/delete", deleteCurriculum);

export default router;
