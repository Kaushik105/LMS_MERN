import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
	const user = req.user;

	return res
		.status(200)
		.json(new ApiResponse(200, { user }, "Authorised user"));
});

export default router;
