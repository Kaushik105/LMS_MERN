import { Router } from "express";
import {
	getStudentViewCourseDetails,
	getStudentViewCourseList,
} from "../controllers/studentView.controller.js";

const router = Router();

router.get("/course/get", getStudentViewCourseList);
router.get("/course/get/:id", getStudentViewCourseDetails);

export default router;
