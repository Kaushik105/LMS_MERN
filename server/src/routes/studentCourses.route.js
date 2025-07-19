import express from "express"
import { getIfCourseIsPurchased, getPurchasedCourses } from "../controllers/studentCourses.controller.js"

const router = express.Router()

router.get("/bought-courses/:id", getPurchasedCourses)
router.get("/:id/:courseId", getIfCourseIsPurchased)

export default router