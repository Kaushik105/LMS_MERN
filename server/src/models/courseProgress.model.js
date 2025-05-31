import mongoose from "mongoose";


const lectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date,
})

const courseProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lecturesProgress: [lectureProgressSchema]
})


export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)