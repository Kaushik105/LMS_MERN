import "dotenv/config";
import { connectDB } from "./db/index.js";
import app from "./app.js";


connectDB()
	.then(() => {
		app.on("error", (error) => {
			console.log("Mongodb connection failed :: ", error);
			throw error;
		});
		app.listen(process.env.PORT || 3000, () => {
			console.log("app is listening\n");
		});
	})
	.catch((error) => {
		console.log("Mongodb connection failed :: ", error);
	});

