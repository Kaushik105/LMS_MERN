import { Router } from "express";
import { addNewCourse, getAllInstuctorCourses, getInstructorCourseDetailsById, updateInstructorCourseById } from "../controllers/course.controller.js";

const router = Router()


router.post("/add", addNewCourse)
router.get("/get", getAllInstuctorCourses)
router.put("/update/:id", updateInstructorCourseById)
router.get("/get/details/:id", getInstructorCourseDetailsById)

export default router