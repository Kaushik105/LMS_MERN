import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
	const { userName, userEmail, password, role } = req.body;

	if (!(userEmail || userName || password || role)) {
		throw new ApiError(400, "Invalid register credentials");
	}

	const existedUser = await User.findOne({ userEmail });

	if (existedUser) {
		throw new ApiError(400, "Email already registered");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({
		userName,
		userEmail,
		password: hashedPassword,
		role,
	});

	if (!newUser) {
		throw new ApiError(500, "user registration failed");
	}

	const accessToken = await newUser.generateAccessToken();

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				accessToken,
				user: {
					userName: newUser.userName,
					userEmail: newUser.userEmail,
					role: newUser.role,
					_id: newUser._id
				},
			},
			"Registration successful"
		)
	);
});

const loginUser = asyncHandler(async (req, res) => {
	const { userEmail, password } = req.body;

	if (!(userEmail || password)) {
		throw new ApiError(400, "Invalid login credentials");
	}

	const loginUser = await User.findOne({ userEmail });

	if (!loginUser) {
		throw new ApiError(400, "User doesn't exists");
	}

	if (!(await loginUser.isPasswordCorrect(password))) {
		throw new ApiError(400, "Incorrect password");
	}

	const accessToken = await loginUser.generateAccessToken();

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				accessToken,
				user: {
					userName: loginUser.userName,
					userEmail: loginUser.userEmail,
					role: loginUser.role,
					_id: loginUser._id,
				},
			},
			"Logged in successfully"
		)
	);
});

export { registerUser, loginUser };
