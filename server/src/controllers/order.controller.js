import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { StudentCourses } from "../models/studentCourses.model.js";
import paypal from "../helpers/paypal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";

const createOrder = asyncHandler(async (req, res) => {
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

	const create_payment_json = {
		intent: "sale",
		payer: {
			paymentMethod: "paypal",
		},
		redirect_urls: {
			return_url: `${process.env.CLIENT_URL}/payment-return`,
			cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
		},
		transactions: [
			{
				item_list: {
					items: [
						{
							name: courseTitle,
							skew: courseId,
							price: coursePricing,
							currency: "USD",
							quantity: 1,
						},
					],
				},
				amount: {
					currency: "USD",
					total: coursePricing,
				},
				description: courseTitle,
			},
		],
	};

	paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
		if (error) {
			console.log(error);
			return res
				.status(500)
				.json(new ApiError(500, "Error while creating paypal payment"));
		}

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

		const approvalUrl = paymentInfo.links.find(
			(link) => link.rel == "approval_url"
		);

		res
			.status(201)
			.json(
				new ApiResponse(
					201,
					{ approvalUrl, orderId: newOrder._id },
					"Order creation successful"
				)
			);
	});
});

const captureFinalizeOrder = asyncHandler(async (req, res) => {
	const { paymentId, payerId, orderId } = req.body;

	let order = await Order.findById(orderId);

	if (!order) {
		return res.status(500).json(new ApiError(500, "order not found"));
	}

	order.paymentStatus = "paid";
	order.orderStatus = "confirmed";
	(order.paymentId = paymentId), (order.payerId = payerId);

	const studentCourses = await StudentCourses.findOne({
		userId: order.userId,
	});

	if (studentCourses) {
		studentCourses.courses.push({
			courseId: order.courseId,
			title: order.courseTitle,
			instructorId: order.instructorId,
			instructorName: order.instructorName,
			dateOfPurchase: order.orderDate,
			courseImage: order.courseImage,
		});

		await studentCourses.save();
	} else {
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

	//update the course schema  students

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

	res.status(200).json(new ApiResponse(200, order, "Order confirmed"));
});


export { captureFinalizeOrder, createOrder };