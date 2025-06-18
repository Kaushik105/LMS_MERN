import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import fs from "node:fs/promises";

const handleUpload = asyncHandler(async (req, res) => {
	const filePath = req?.file?.path;

	if (!filePath) {
		throw new ApiError(400, "file path unavailable");
	}

	const uploadResponse = await uploadMedia(filePath);

	await fs.unlink(filePath);

	return res
		.status(200)
		.json(new ApiResponse(200, uploadResponse, "media uploaded successfully"));
});
const handleBulkUpload = asyncHandler(async (req, res) => {
	const filesPath = req?.files?.map((fileItem) => fileItem.path);

	if (!(filesPath || Array.isArray(filesPath) || filesPath.length <= 0)) {
		throw new ApiError(400, "files path unavailable");
	}

	let bulkUploadPromises = filesPath.map(async (filePath) => {
		const uploadResponse = await uploadMedia(filePath);
		await fs.unlink(filePath);
		return uploadResponse;
	});
	const bulkUploadResponse = await Promise.all(bulkUploadPromises);

	return res
		.status(200)
		.json(
			new ApiResponse(200, bulkUploadResponse, "media uploaded successfully")
		);
});
const handleDelete = asyncHandler(async (req, res) => {
	const { publicId } = req?.params;

	if (!publicId) {
		throw new ApiError(400, "file publicId unavailable");
	}

	const deleteResponse = await deleteMedia(publicId);

	return res
		.status(200)
		.json(new ApiResponse(200, deleteResponse, "media deleted successfully"));
});

export { handleDelete, handleUpload, handleBulkUpload };
