import { userModel } from "@/models/user";
import { envs } from "@/plugins/envs-plugin";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import express from "express";

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

// authenticate user and get token
export const authenticateUser = async function (
	req: express.Request,
	res: express.Response,
) {
	// check if there are any errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// extract email and password from request body
	const { email, password } = req.body;

	try {
		// Check the user have already registered with an email
		let user = await userModel.findOne({ email });

		if (!user) {
			return res.status(400).json({ msg: "User not exists" });
		}

		// Check if the password is correct
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: "Incorrect password" });
		}

		// if all right create and sign a token
		const payload = {
			user: {
				_id: user._id,
			},
		};

		// sign the token and send it in the response
		jwt.sign(
			payload,
			envs.SECRET_KEY,
			{ expiresIn: 86400 },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			},
		);
	} catch (error) {
		console.log(error);
		res.status(400).send("There was an error creating the user");
	}
};

// get authenticated user
export const authenticatedUser = async function (
	req: express.Request,
	res: express.Response,
) {
	try {
		const user = await userModel.findById(req.user._id).select("-password");
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Error getting user" });
	}
};
