import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import { ProjectModel } from "@/models/project";
import { TaskModel, type TaskType } from "@/models/task";

// create a new task
export const createTask = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// extract the project to check if it exists
	const { projectId, name } = req.body;

	try {
		const project = await ProjectModel.findById(projectId);
		if (!project) {
			return res
				.status(404)
				.json({ msg: "Project with id " + projectId + " not found" });
		}

		// check if the current project is the owner of the authenticated user
		if (
			!project.createdBy ||
			project.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// create a new task object
		const newTask = new TaskModel({
			name,
			state: false,
			projectId: projectId,
		});

		// create a new task
		await newTask.save();
		res.json({ newTask });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error creating the task");
	}
};

// get tasks by project
export const getTasksByProject = async (req: Request, res: Response) => {
	const { projectId } = req.query;

	try {
		// check if the project exists
		const project = await ProjectModel.findById(projectId);

		if (!project) {
			return res
				.status(404)
				.json({ msg: "Project with id " + projectId + " not found" });
		}

		// check if the current project is the owner of the authenticated user
		if (
			!project.createdBy ||
			project.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// get tasks by project
		const tasks = await TaskModel.find({
			projectId: projectId as string,
		}).sort({ createdBy: -1 });
		res.json({ tasks });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error getting the tasks");
	}
};

// update task
export const updateTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const { projectId, name, state } = req.body;

		// check if the task exists
		let task = await TaskModel.findById(id);
		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// extract project
		const projectExists = await ProjectModel.findById(projectId);
		if (!projectExists) {
			return res
				.status(404)
				.json({ msg: "Project with id " + projectId + " not found" });
		}

		// check if the current project is the owner of the authenticated user
		if (
			!projectExists.createdBy ||
			projectExists.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// create a new task object
		const updatedTask: Partial<TaskType> = { ...task.toObject() };
		if (name) updatedTask.name = name;
		if (state !== undefined) updatedTask.state = state;

		// update the task
		await TaskModel.findOneAndUpdate({ _id: id }, updatedTask, {
			new: true,
		});
		res.json({ task });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error updating the task");
	}
};

// delete task
export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		// check if the task exists
		const task = await TaskModel.findById(id);
		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// extract project
		const project = await ProjectModel.findById(task.projectId);
		if (!project) {
			return res.status(404).json({
				msg: "Project with id " + task.projectId + " not found",
			});
		}

		// check if the current project is the owner of the authenticated user
		if (
			!project.createdBy ||
			project.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// delete the task
		await TaskModel.findByIdAndDelete({ _id: id });
		res.json({ msg: "Task with id " + id + " deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error deleting the task");
	}
};
