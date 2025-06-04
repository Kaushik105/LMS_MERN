import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
	const authHeader = req.headers?.authorization;

	if (!authHeader) {
		throw new ApiError(400, "Unauthorised user request");
	}

	const token = authHeader?.split(" ")[1];

	const payload = jwt.verify(token, process.env.JWT_SECRET);

	if (!payload) {
		throw new ApiError(400, "Invalid token");
	}

	req.user = payload;

	next();
}
