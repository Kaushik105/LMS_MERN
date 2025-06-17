import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
	userName: String,
	userEmail: String,
	password: String,
	role: String,
});


userSchema.methods.generateAccessToken = function() {
	
	
	return jwt.sign(
		{
			userName: this.userName,
			userEmail: this.userEmail,
			role: this.role,
			_id: this._id
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "1h"
		}
	);
};

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
