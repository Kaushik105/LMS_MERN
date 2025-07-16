import express from "express";
import {
	captureFinalizeOrder,
	createOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/finalize", captureFinalizeOrder);


export default router