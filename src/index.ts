import cors from "cors";
import express from "express";
import { userRouter } from "@/routes/users";
import { envs } from "@/plugins/envs-plugin";
import { connectDB } from "@/config/database";
import { authRouter } from "@/routes/auth";
import { tasksRouter } from "@/routes/tasks";
import { projectsRouter } from "./routes/projects";

// create server
const app = express();

// connect to database
connectDB();

// enable cors
app.use(cors());

// enable express.json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

// start the server
app.listen(envs.PORT, "0.0.0.0", () => {
	console.log(`Server is running on port ${envs.PORT}`);
});
