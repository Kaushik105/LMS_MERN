import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: String,
	userEmail: String,
	password: String,
	role: String,
});

export const User = mongoose.model("User", userSchema);
