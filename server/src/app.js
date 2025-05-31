import express from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";


const app = express()

app.use(express.json());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(errorHandler);
export default app

