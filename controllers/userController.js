const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async function(req, res) {
	// check if there are any errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// extract email and password from request body
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// create a new user
		user = new User(req.body);

		// hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		// save user to database
		await user.save();

		// create and sign a token
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