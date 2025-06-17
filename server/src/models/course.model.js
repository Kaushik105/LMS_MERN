import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
	title: String,
	videoUrl: String,
	publicId: String,
	freePreview: String,
});

const courseSchema = new mongoose.Schema({
	instructorId: String,
	instructorName: String,
	date: Date,
	title: String,
	category: String,
	primaryLanguage: String,
	subtitle: String,
	description: String,
	image: String,
	pricing: String,
	objectives: String,
	students: [
		{
			studentId: String,
			studentName: String,
			studentEmail: String,
			paidAmount: Number,
		},
	],
	isPublished: Boolean,
	curriculum: [lectureSchema],
});

export const Course = mongoose.model("Course", courseSchema);
