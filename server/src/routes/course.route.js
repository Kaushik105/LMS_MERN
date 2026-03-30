import { Router } from "express";
import {
	addNewCourse,
	getAllInstuctorCourses,
	getInstructorCourseDetailsById,
	updateInstructorCourseById,
} from "../controllers/course.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", authenticate, addNewCourse);
router.get("/get", authenticate, getAllInstuctorCourses);
router.put("/update/:id", authenticate, updateInstructorCourseById);
router.get("/get/details/:id", authenticate, getInstructorCourseDetailsById);

export default router;
