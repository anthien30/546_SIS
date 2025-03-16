import express from "express";

import { createCourse, searchCourses } from "../controllers/courseController";

const router = express.Router();

router.post("/register", createCourse);
router.get("/search", searchCourses);

export default router;
