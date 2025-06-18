import { Router } from "express";
import multer from "multer";
import {
	handleDelete,
	handleUpload,
	handleBulkUpload,
} from "../helpers/mediaHandler.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), handleUpload);
router.post("/bulk-upload", upload.array("files", 10), handleBulkUpload);
router.delete("/delete/:publicId", handleDelete);

export default router;
