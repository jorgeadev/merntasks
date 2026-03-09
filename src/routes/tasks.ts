import { createTask, deleteTask, getTasksByProject, updateTask } from "@/controllers/task-controller";
import { auth } from "@/middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";

const router = express.Router();

// create a new task
// @route   POST api/tasks
router.post('/',
	auth,
	[
		check('name', 'Name is required').not().isEmpty(),
		check('projectId', 'ProjectId is required').not().isEmpty()
	],
	createTask
);

// get tasks by project
router.get('/',
	auth,
	getTasksByProject
);

// update task
router.put('/:id',
	auth,
	updateTask
);

// delete task
router.delete('/:id',
	auth,
	deleteTask
);

export const tasksRouter: Router = router;