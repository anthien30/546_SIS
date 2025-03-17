import express from "express";
import {
  createSchedule,
  deleteSchedule,
  searchSchedule,
  updateSchedule,
} from "../controllers/scheduleController";

const router = express.Router();

router.get("/search", searchSchedule);
router.post("/create", createSchedule);
router.post("/update", updateSchedule);
router.delete("/delete", deleteSchedule);

export default router;
