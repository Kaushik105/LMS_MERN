import express from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRouter from "./routes/auth.route.js"
import mediaRouter from  "./routes/media.routes.js"

const app = express()

app.use(express.json());
app.use(express.urlencoded())
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Content-Type", "Authorization"]
	})
);

//Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/media", mediaRouter)


app.use(errorHandler);
export default app

