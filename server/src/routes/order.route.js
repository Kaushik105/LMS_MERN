import express from "express";
import {
	captureFinalizeOrder,
	createOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/:orderID/capture", captureFinalizeOrder);


export default router