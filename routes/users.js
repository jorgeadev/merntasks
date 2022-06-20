// Create user routes
// Language: javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

/**
 * Create a new user
 * @route   POST api/users
 * @param { request } req Request object to server
 * @param { response } res Response object from server
 * @return { number } x raised to the n-th power
 */
router.post('/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	userController.createUser
);

module.exports = router;