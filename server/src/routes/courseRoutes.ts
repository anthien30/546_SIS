import express from "express";

import {
  createCourse,
  deleteCourse,
  searchCourses,
  updateCourse,
} from "../controllers/courseController";

const router = express.Router();

router.post("/register", createCourse);
router.get("/search", searchCourses);
router.post("/update", updateCourse);
router.delete("/delete", deleteCourse);

export default router;
