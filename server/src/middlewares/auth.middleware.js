import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers?.authorization;

	if (!authHeader) {
		throw new ApiError(401, "Unauthorized user request");
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		throw new ApiError(401, "Token not found");
	}

	let payload;
	try {
		payload = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new ApiError(401, "Invalid token");
	}

	req.user = payload;
	next();
});
