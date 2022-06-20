const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authenticateUser = async function(req, res) {
	// check if there are any errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// extract email and password from request body
	const { email, password } = req.body;
	try {
		// Check the user have already registered with an email
		let user = await User.findOne({ email });

		console.log('user ', user);

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
				_id: user._id
			}
		}
		jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 86400 }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (error) {
		console.log(error);
		res.status(400).send('There was an error creating the user');
	}
}

// get authenticated user
exports.authenticatedUser = async function(req, res) {
	try {
		const user = await User.findById(req.user._id).select('-password');
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Error getting user" });
	}
}