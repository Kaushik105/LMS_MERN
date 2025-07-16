import { Router } from "express";
import {
	getStudentViewCourseDetails,
	getStudentViewCourseList,
} from "../controllers/studentView.controller.js";

const router = Router();

router.get("/get", getStudentViewCourseList);
router.get("/get/details/:id", getStudentViewCourseDetails);

export default router;
