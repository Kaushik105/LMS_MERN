import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { StudentCourses } from "../models/studentCourses.model.js";

const getIfCourseIsPurchased = asyncHandler(async (req, res) => {
	const { id, courseId } = req.params;

	const isCourseAlreadyPurchased = await StudentCourses.findOne({
		userId: id,
		"courses.courseId": courseId,
	});

	if (!isCourseAlreadyPurchased) {
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ isPurchased: false },
					"Course purchase status fetched"
				)
			);
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ isPurchased: true },
				"Course purchase status fetched"
			)
		);
});

const getPurchasedCourses = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const boughtCourses = await StudentCourses.findOne({ userId: id });

	if (!boughtCourses) {
		return res.status(200).json(new ApiResponse(200, {}, "No courses found"));
	}
	return res
		.status(200)
		.json(new ApiResponse(200, boughtCourses?.courses, "courses found"));
});

export { getIfCourseIsPurchased, getPurchasedCourses };
