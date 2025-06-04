import { ApiResponse } from "../utils/ApiResponse.js";

function errorHandler(err, req, res, next) {
	console.log("SERVER ERROR :: ", err);

	// Get the status code from error or default to 500
	const statusCode = err.statusCode || err.status || 500;

	// Get the error message
	const message = err.message || "Internal Server Error";

	// Send formatted error response
	res.status(statusCode).json(
		new ApiResponse(
			statusCode,
			err.stack, // Only include stack trace in development
			message,
		)
	);
}

export { errorHandler };