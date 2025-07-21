import express from "express";
import {
	getCurrentCourseProgress,
	markCurrentLecture,
	resetProgress,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/post", markCurrentLecture);
router.post("/reset", resetProgress);

export default router;
