import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadMedia(filePath) {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			resource_type: "auto",
			folder: "LMS_MERN",
		});

		return result;
	} catch (error) {
		console.log(error);

		throw new ApiError(500, "upload to cloudinary failed");
	}
}
async function deleteMedia(publicId) {
	try {
		
		const result = await cloudinary.uploader.destroy(publicId, {resource_type: "video"});
        return result
	} catch (error) {
		console.log(error);

		throw new ApiError(500, "delete to cloudinary failed");
	}
}

export { uploadMedia, deleteMedia };
