import { ProjectModel, type ProjectType } from "@/models/project";
import { TaskModel } from "@/models/task";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";

// create project
export const createProject = async (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// create a new project
		const project = new ProjectModel(req.body);
		// save cratedBy
		project.createdBy = req.user._id;
		// save the project
		await project.save();
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error creating the project");
	}
};

// get all projects of current user
export const getProjects = async (req: Request, res: Response) => {
	try {
		// get all projects of current user
		const projects = await ProjectModel.find({
			createdBy: req.user._id,
		}).sort({ createdAt: -1 });
		res.json({ projects });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error getting the projects");
	}
};

// update project
export const updateProject = async (req: Request, res: Response) => {
	const { id } = req.params;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// extract the project info from the request
	const { name } = req.body;

	// create a new project object
	const newProject: Partial<ProjectType> = {};
	if (name) newProject.name = name;

	try {
		// get the project
		let project = await ProjectModel.findById(id);

		// check if the project exists
		if (!project) {
			return res.status(404).json({ msg: "Project not found" });
		}

		// check if the user is the owner of the project
		if (
			!project.createdBy ||
			project.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// update the project
		project = await ProjectModel.findByIdAndUpdate(
			{ _id: id },
			{ $set: newProject },
			{ new: true },
		);
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error updating the project");
	}
};

// delete project by id
export const deleteProject = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		// check the id is valid
		let project = await ProjectModel.findById(id);

		// check if the project exists
		if (!project) {
			return res.status(404).json({ msg: "Project not found" });
		}

		// check if the user is the owner of the project
		if (
			!project.createdBy ||
			project.createdBy.toString() !== req.user._id
		) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// delete related tasks
		await TaskModel.deleteMany({
			projectId: new Types.ObjectId(id as string),
		});

		// delete the project
		await ProjectModel.findOneAndDelete({
			_id: new Types.ObjectId(id as string),
		});
		res.json({ msg: `Project with id ${id} deleted` });
	} catch (error) {
		console.log(error);
		res.status(500).send("There was an error deleting the project");
	}
};
