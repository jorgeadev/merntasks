import { userModel } from "@/models/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { envs } from "@/plugins/envs-plugin";
import express from "express";

// authenticate user and get token
const createUser = async function (
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
		let user = await userModel.findOne({ email });

		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// create a new user
		user = new userModel(req.body);

		// hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		// save user to database
		await user.save();

		// create and sign a token
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

export { createUser };
