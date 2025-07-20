import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRouter from "./routes/auth.route.js";
import mediaRouter from "./routes/media.route.js";
import instrtuctorCourseRouter from "./routes/course.route.js";
import studentViewRotuer from "./routes/studentView.route.js";
import studentViewOrderRotuer from "./routes/order.route.js";
import studentCoursesRouter from "./routes/studentCourses.route.js"
import studentCourseProgressRouter from "./routes/courseProgress.route.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(
	cors({
		origin: [process.env.CLIENT_URL],
		methods: ["GET", "POST", "DELETE", "PUT"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/media", mediaRouter); //TODO: getting the secure url from cloudinary response
app.use("/api/v1/instructor/course", instrtuctorCourseRouter);
//studentview
//TODO: fix the error in the route
app.use("/api/v1/student/course", studentViewRotuer);
app.use("/api/v1/student/order", studentViewOrderRotuer);
app.use("/api/v1/student/course-status", studentCoursesRouter);
app.use("/api/v1/student/course-progress", studentCourseProgressRouter);

app.use(errorHandler);
export default app;
