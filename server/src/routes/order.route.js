import express from "express";
import {
	captureFinalizeOrder,
	createOrder,
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.post("/:orderID/capture", authenticate, captureFinalizeOrder);

export default router;
