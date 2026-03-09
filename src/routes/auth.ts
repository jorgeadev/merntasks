import { authenticatedUser, authenticateUser } from "@/controllers/authController";
import { auth } from "@/middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";

const router = express.Router();

/**
 * Create a new user
 * @route   POST api/auth
 */
router.post('/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	authenticateUser
);

router.get('/',
	auth,
	authenticatedUser
);

export const authRouter: Router = router;