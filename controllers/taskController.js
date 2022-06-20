const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require("express-validator");

// create a new task
exports.createTask = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// extract the project to check if it exists
	const idProject = req.body.project;
	try {
		const project = await Project.findById(idProject);
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// check if the current project is the owner of the authenticated user
		if (project.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// create a new task
		const task = new Task(req.body);
		await task.save();
		res.json({ task });

	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error creating the task');
	}
}

// get tasks by project
exports.getTasksByProject = async (req, res) => {
	try {
		const idProject = req.query.project;
		const project = await Project.findById(idProject);
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// check if the current project is the owner of the authenticated user
		if (project.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// get tasks by project
		const tasks = await Task.find({ project: idProject }).sort({ createdBy: -1 });
		res.json({ tasks });

	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error getting the tasks');
	}
}

// update task
exports.updateTask = async (req, res) => {
	try {
		const { project, name, state } = req.body;

		// check if the task exists
		let task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: 'Task not found' });
		}

		// extract project
		const projectExists = await Project.findById(project);
		if (!projectExists) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// check if the current project is the owner of the authenticated user
		if (projectExists.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// update the task
		task.name = name;
		task.state = state;
		await Task.findOneAndUpdate({ _id: req.params.id }, task, { new: true });
		res.json({ task });

	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error updating the task');
	}
}

// delete task
exports.deleteTask = async (req, res) => {
	try {
		const projectId = req.query.project;

		// check if the task exists
		let task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).json({ msg: 'Task not found' });
		}

		// extract project
		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// check if the current project is the owner of the authenticated user
		if (project.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// delete the task
		await Task.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: 'Task deleted' });

	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error deleting the task');
	}
}