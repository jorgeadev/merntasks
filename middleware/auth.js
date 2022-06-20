const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
	// read the token from the header
	const token = req.header('x-auth-token');

	// check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	// verify token
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token is not valid' });
	}
}