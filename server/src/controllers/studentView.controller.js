import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";

const getStudentViewCourseList = asyncHandler(async (req, res) => { 
    const courseList = await Course.find({isPublished: true})

    if (!courseList) {
        throw new ApiError(500, "no courses found")
    }

    return res.status(200).json(new ApiResponse(200, courseList, "courses found"))
})


const getStudentViewCourseDetails = asyncHandler(async (req, res) => {
    const { id }  = req?.params 

    if (!id) {
        throw new ApiError(400, "Invalid course id")
    }

    const course = await Course.findById(id)

    if (!course) {
			throw new ApiError(500, "no courses found");
		}

    return res.status(200).json(new ApiResponse(200, course, "course details found"));
})

export {getStudentViewCourseDetails, getStudentViewCourseList}