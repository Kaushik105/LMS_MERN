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

	//saving the order in the database
	const newOrder = await Order.create({
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
	});

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
					customId: String(newOrder._id),
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

	//callin the paypal createorder api
	const { body, ...httpResponse } = await ordersController.createOrder(collect);

	//sending the response
	return res
		.status(httpResponse.statusCode)
		.json({ ...JSON.parse(body), newOrderId: String(newOrder._id) });
});

//Capture Order Controller
const captureFinalizeOrder = asyncHandler(async (req, res) => {
	//getting the orderId from request
	const { orderID } = req.params;
	const { paymentId, payerId, newOrderId } = req.body;

	//capturing the order status
	const { body, ...httpResponse } = await ordersController.captureOrder({
		id: orderID,
		prefer: "return=minimal",
	});

	res.status(httpResponse.statusCode).json(JSON.parse(body));

	
	//TODO: update the order status in order model
	let order = await Order.findById(newOrderId);
	
	if (!order) {
		return res.status(500).json(new ApiError(500, "order not found"));
	}
	
	order.paymentStatus = "paid";
	order.orderStatus = "confirmed";
	order.paymentId = paymentId;
	order.payerId = payerId;
	
	await order.save()
	
	//TODO: update the student courses model to push this course in the courses array
	
	const studentCourses = await StudentCourses.findOne({
		userId: order.userId,
	});
	
	if (studentCourses) {
		if (!(studentCourses.courses.findIndex(course => course.courseId == order.courseId) !== -1)) {
	
			studentCourses.courses.push({
				courseId: order.courseId,
				title: order.courseTitle,
				instructorId: order.instructorId,
				instructorName: order.instructorName,
				dateOfPurchase: order.orderDate,
				courseImage: order.courseImage,
			});
			
			await studentCourses.save();
			
		}
	} else {
		console.log("NOt exists");
		
		const newStudentCourses = new StudentCourses({
			userId: order.userId,
			courses: [
				{
					courseId: order.courseId,
					title: order.courseTitle,
					instructorId: order.instructorId,
					instructorName: order.instructorName,
					dateOfPurchase: order.orderDate,
					courseImage: order.courseImage,
				},
			],
		});
		
		await newStudentCourses.save();
	}
	
	//TODO: update the students array of the course model


	await Course.findByIdAndUpdate(order.courseId, {
		$addToSet: {
			students: {
				studentId: order.userId,
				studentName: order.username,
				studentEmail: order.userEmail,
				paidAmount: order.coursePricing,
			},
		},
	});
});

export { captureFinalizeOrder, createOrder };
