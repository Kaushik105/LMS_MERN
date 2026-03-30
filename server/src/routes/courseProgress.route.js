import express from "express";
import {
	getCurrentCourseProgress,
	markCurrentLecture,
	resetProgress,
} from "../controllers/courseProgress.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get/:userId/:courseId", authenticate, getCurrentCourseProgress);
router.post("/post", authenticate, markCurrentLecture);
router.post("/reset", authenticate, resetProgress);

export default router;
