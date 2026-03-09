import { envs } from "@/plugins/envs-plugin";
import jwt from "jsonwebtoken";
import express from 'express';

export const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	// read the token from the header
	const token = req.header('x-auth-token');

	// check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	// verify token
	try {
		const decoded = jwt.verify(token, envs.SECRET_KEY);

		if (typeof decoded === 'object' && decoded !== null && 'user' in decoded) {
			req.user = decoded.user;
		}
		
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token is not valid' });
	}
}