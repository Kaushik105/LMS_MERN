import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StudentCourses } from "../models/studentCourses.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";

//mark current lecture as viewed
const markCurrentLecture = asyncHandler(async (req, res) => {
	const { userId, courseId, completedLecture } = req.body;

	const progress = await CourseProgress.findOne({
		userId,
		courseId,
	});

	if (!progress) {
		return res
			.status(500)
			.json(new ApiError(500, "Unable to fetch corse progress"));
	}

	const course = await Course.findById(courseId);

	//check if the lecture is already viewed
	if (
		!(
			progress.lecturesProgress.findIndex(
				(item) => item.lectureId === completedLecture._id
			) > -1
		)
	) {
		progress.lecturesProgress.push({
			lectureId: completedLecture._id,
			dateViewed: new Date(),
			viewed: true,
		});
	}

	//check if all the lectures are completed or not

	const isAllLecturesCompleted =
		progress.lecturesProgress.length === course.curriculum.length &&
		progress.lecturesProgress.every((item) => item.viewed);
	if (isAllLecturesCompleted) {
		progress.completed = true;
	}

	const updatedProgress = await progress.save();

	return res
		.status(200)
		.json(new ApiResponse(200, updatedProgress, "course progress updated"));
});

// get current course progress if it available
const getCurrentCourseProgress = asyncHandler(async (req, res) => {
	const { userId, courseId } = req.params;

	const studentPurchasedCourse = await StudentCourses.findOne({
		userId,
		"courses.courseId": courseId,
	}).lean();

	//checking if this course is purchased by the user
	const isCurrentCourseIsPurchasedByCurrentUser =
		studentPurchasedCourse?.courses?.findIndex(
			(item) => item.courseId === courseId
		) > -1;
	if (!isCurrentCourseIsPurchasedByCurrentUser) {
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ isPurchased: false },
					"You have to purchase this course to access it"
				)
			);
	}

	const currentCourseProgress = await CourseProgress.findOne({
		userId,
		courseId,
	});

	const courseDetails = await Course.findById(courseId);

	//creating course progress document if there is none
	if (!currentCourseProgress) {
		const newCourseProgress = await CourseProgress.create({
			userId,
			courseId,
			completed: false,
			lecturesProgress: [],
		});

		//sending the response
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ progress: newCourseProgress, courseDetails },
					"no progress found, start the course to get progress"
				)
			);
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ progress: currentCourseProgress, courseDetails },
				"course progress fetched"
			)
		);
});

//reset course progress
const resetProgress = asyncHandler(async (req, res) => {
	const { userId, courseId } = req.body;
	const progress = await CourseProgress.findOneAndUpdate(
		{
			userId,
			courseId,
		},
		{
			completed: false,
			lecturesProgress: [],
		}
	);

	if (!progress) {
		return res
			.status(500)
			.json(new ApiError(500, "Course progress reset failed"));
	}

	return res
		.status(200)
		.json(new ApiResponse(200, progress, "Course progress reset successful"));
});

export { getCurrentCourseProgress, markCurrentLecture, resetProgress };
