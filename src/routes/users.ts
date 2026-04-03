import express, { Router } from "express";
import { createUser } from "@/controllers/userController";
import { check } from "express-validator";

const router = express.Router();

/**
 * Create a new user
 * @route   POST api/users
 * @param { request } req Request object to server
 * @param { response } res Response object from server
 * @return { number } x raised to the n-th power
 */
export const userRouter: Router = router.post(
	"/",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters",
		).isLength({ min: 6 }),
	],
	createUser,
);
