import express from "express";
import {
	getCurrentCourseProgress,
	markCurrentLecture,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/post", markCurrentLecture);

export default router;
