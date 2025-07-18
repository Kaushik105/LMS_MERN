import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { StudentCourses } from "../models/studentCourses.model.js";
import client from "../helpers/paypal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";
import {
	CheckoutPaymentIntent,
	OrdersController,
} from "@paypal/paypal-server-sdk";
import { log } from "node:console";

const ordersController = new OrdersController(client);

// Create Order Controller
const createOrder = asyncHandler(async (req, res) => {
	//fetching order data from the request
	const {
		userId,
		username,
		userEmail,
		orderStatus,
		paymentMethod,
		paymentStatus,
		orderDate,
		paymentId,
		payerId,
		instructorId,
		instructorName,
		courseImage,
		courseTitle,
		courseId,
		coursePricing,
	} = req.body;

	//creating payload to create paypal order
	const collect = {
		body: {
			intent: CheckoutPaymentIntent.Capture,
			purchaseUnits: [
				{
					amount: {
						currencyCode: "USD",
						value: String(coursePricing),
						breakdown: {
							itemTotal: {
								currencyCode: "USD",
								value: String(coursePricing),
							},
						},
					},
					items: [
						{
							name: courseTitle,
							unitAmount: {
								currencyCode: "USD",
								value: String(coursePricing),
							},
							quantity: "1",
							description: courseTitle,
							sku: courseId,
						},
					],
				},
			],
		},
		prefer: "return=minimal",
	};

	

	//saving the order in the database
	
	//callin the paypal createorder api
	const { body, ...httpResponse } = await ordersController.createOrder(collect);
	// const newOrder = await Order.create({
	// 	userId,
	// 	username,
	// 	userEmail,
	// 	orderStatus,
	// 	paymentMethod,
	// 	paymentStatus,
	// 	orderDate,
	// 	paymentId,
	// 	payerId,
	// 	instructorId,
	// 	instructorName,
	// 	courseImage,
	// 	courseTitle,
	// 	courseId,
	// 	coursePricing,
	// });

	//sending the response
	return res.status(httpResponse.statusCode).json(JSON.parse(body))
});

//Capture Order Controller
const captureFinalizeOrder = asyncHandler(async (req, res) => {
	//getting the orderId from request
	const { orderID } = req.params;
	

	//capturing the order status
	const { body, ...httpResponse } = await ordersController.captureOrder(
		{id:orderID, prefer: "return=minimal"}
	)
	
	res.status(httpResponse.statusCode).json(JSON.parse(body));
	
	//TODO: update the order status in order model
	//TODO: update the student courses model to push this course in the courses array
	//TODO: update the students array of the course model

	// let order = await Order.findById(orderID);

	// if (!order) {
	// 	return res.status(500).json(new ApiError(500, "order not found"));
	// }

	// order.paymentStatus = "paid";
	// order.orderStatus = "confirmed";
	// (order.paymentId = paymentId), (order.payerId = payerId);

	// const studentCourses = await StudentCourses.findOne({
	// 	userId: order.userId,
	// });

	// if (studentCourses) {
	// 	studentCourses.courses.push({
	// 		courseId: order.courseId,
	// 		title: order.courseTitle,
	// 		instructorId: order.instructorId,
	// 		instructorName: order.instructorName,
	// 		dateOfPurchase: order.orderDate,
	// 		courseImage: order.courseImage,
	// 	});

	// 	await studentCourses.save();
	// } else {
	// 	const newStudentCourses = new StudentCourses({
	// 		userId: order.userId,
	// 		courses: [
	// 			{
	// 				courseId: order.courseId,
	// 				title: order.courseTitle,
	// 				instructorId: order.instructorId,
	// 				instructorName: order.instructorName,
	// 				dateOfPurchase: order.orderDate,
	// 				courseImage: order.courseImage,
	// 			},
	// 		],
	// 	});

	// 	await newStudentCourses.save();
	// }

	// //update the course schema  students

	// await Course.findByIdAndUpdate(order.courseId, {
	// 	$addToSet: {
	// 		students: {
	// 			studentId: order.userId,
	// 			studentName: order.username,
	// 			studentEmail: order.userEmail,
	// 			paidAmount: order.coursePricing,
	// 		},
	// 	},
	// });

});

export { captureFinalizeOrder, createOrder };
