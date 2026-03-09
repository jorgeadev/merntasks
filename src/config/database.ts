import { envs } from "@/plugins/envs-plugin";
import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log('Connecting to database...');
		await mongoose.connect(envs.DB_MONGO);
		console.log('MongoDB Connected...');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}