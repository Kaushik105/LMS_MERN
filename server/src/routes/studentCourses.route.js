import express from "express";
import {
	getIfCourseIsPurchased,
	getPurchasedCourses,
} from "../controllers/studentCourses.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/bought-courses/:id", authenticate, getPurchasedCourses);
router.get("/:id/:courseId", authenticate, getIfCourseIsPurchased);

export default router;
