const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// create project
exports.createProject = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		// create a new project
		const project = new Project(req.body);
		// save cratedBy
		project.createdBy = req.user._id;
		// save the project
		await project.save();
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error creating the project');
	}
}

// get all projects of current user
exports.getProjects = async (req, res) => {
	try {
		// get all projects of current user
		const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
		res.json({ projects });
	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error getting the projects');
	}
}

// update project
exports.updateProject = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// extract the project info from the request
	const { name } = req.body;
	const newProject = {};
	if (name) newProject.name = name;

	try {
		// get the project
		let project = await Project.findById(req.params._id);
		console.log('project to update', project);

		// check if the project exists
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// check if the user is the owner of the project
		if (project.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// // update the project
		// project.name = req.body.name;
		// // save the project
		// await project.save();
		// res.json(project);

		// update the project
		project = await Project.findByIdAndUpdate({ _id: req.params._id }, { $set: newProject }, { new: true });
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error updating the project');
	}
}

// delete project by id
exports.deleteProject = async (req, res) => {
	try {
		// check the id is valid
		let project = await Project.findById(req.params.id);
		console.log('project to delete', project);
		// check if the project exists
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}
		// check if the user is the owner of the project
		if (project.createdBy.toString() !== req.user._id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}
		// delete the project
		await Project.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: 'Project deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error deleting the project');
	}
}

