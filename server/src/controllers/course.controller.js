import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";

const addNewCourse = asyncHandler(async (req, res) => {
	const newCourseData = req.body;

	const newCourse = new Course(newCourseData);

	const savedNewCourse = await newCourse.save();

	if (!savedNewCourse) {
		throw new ApiError(500, "Unable to add new course");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, savedNewCourse, "course added"));
});
const getAllInstuctorCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({});

	if (!courses) {
		throw new ApiError(500, "cannot get courses");
	}

	return res.status(200).json(new ApiResponse(200, courses, "course found"));
});
const updateInstructorCourseById = asyncHandler(async (req, res) => {
	const { id } = req?.params;
	const updatedCourseDetails = req.body;

	const updatedCourse = await Course.findByIdAndUpdate(
		id,
		updatedCourseDetails,
		{ new: true }
	);

	if (!updatedCourse) {
		throw new ApiError(500, "course updation failed");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, updatedCourse, "course updated"));
});

const getInstructorCourseDetailsById = asyncHandler(async (req, res) => {
	const { id } = req?.params;
	const courseDetails = await Course.findById(id);

	if (!courseDetails) {
		throw new ApiError(500, "Cannot find course");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, courseDetails, "course details fetched"));
});

export {addNewCourse, getAllInstuctorCourses, getInstructorCourseDetailsById, updateInstructorCourseById}