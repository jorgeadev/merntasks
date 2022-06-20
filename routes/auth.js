const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * Create a new user
 * @route   POST api/auth
 */
router.post('/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	authController.authenticateUser
);

router.get('/',
	auth,
	authController.authenticatedUser
);

module.exports = router;