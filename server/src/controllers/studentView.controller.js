import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";


const getStudentViewCourseList = asyncHandler(async (req, res) => {
	const {
		category = [],
		primaryLanguage = [],
		level = [],
		sortBy = "price-lowtohigh",
	} = req.query;
	const sortOption = {};

	let filters = {};
	if (category.length) {
		filters.category = { $in: category.split(",") };
	}
	if (level.length) {
		filters.level = { $in: level.split(",") };
	}
	if (primaryLanguage.length) {
		filters.primaryLanguage = { $in: primaryLanguage.split(",") };
	}

	switch (sortBy) {
		case "price-lowtohigh":
			sortOption.pricing = 1;

			break;
		case "price-hightolow":
			sortOption.pricing = -1;

			break;
		case "title-atoz":
			sortOption.title = 1;

			break;
		case "title-ztoa":
			sortOption.title = -1;

			break;

		default:
			sortOption.pricing = 1;
			break;
	}

	const filteredCourses = await Course.find(filters).sort(sortOption);

	return res
		.status(200)
		.json(new ApiResponse(200, filteredCourses, "Filtered courses fetched"));
});

const getStudentViewCourseDetails = asyncHandler(async (req, res) => {
	const { id } = req?.params;

	if (!id) {
		throw new ApiError(400, "Invalid course id");
	}

	const course = await Course.findById(id);

	if (!course) {
		throw new ApiError(500, "no courses found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, course, "course details found"));
});

export {
	getStudentViewCourseDetails,
	getStudentViewCourseList,
};
