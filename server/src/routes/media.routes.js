import { Router } from "express";
import multer from "multer";
import { handleDelete, handleUpload } from "../helpers/mediaHandler.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), handleUpload);
router.delete("/delete/:publicId", handleDelete);

export default router;
