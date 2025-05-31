import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: String,
    username: String,
    userEmail: String,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    instructorId: String,
    instructorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePricing: Number,
})

export const Order = mongoose.model("Order", orderSchema)