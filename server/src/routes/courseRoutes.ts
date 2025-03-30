import express from "express";

import {
  createCourse,
  deleteCourse,
  getCourseEligibility,
  searchCourses,
  updateCourse,
} from "../controllers/courseController";

const router = express.Router();

router.post("/register", createCourse);
router.get("/search", searchCourses);
router.post("/update", updateCourse);
router.delete("/delete", deleteCourse);
router.get("/eligibility", getCourseEligibility);

export default router;
