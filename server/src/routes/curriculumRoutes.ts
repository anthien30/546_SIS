import express from "express";
import { createCurriculum } from "../controllers/curriculumController";

const router = express.Router();

router.post("/create", createCurriculum);

export default router;
