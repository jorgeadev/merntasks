import { createProject, deleteProject, getProjects, updateProject } from '@/controllers/project-controller';
import { auth } from '@/middleware/auth';
import express, { Router } from 'express';
import { check } from 'express-validator';

const router = express.Router();

// @route   POST api/projects
router.post('/',
	auth,
	[
		check('name', 'Name is required').not().isEmpty()
	],
	createProject
);

// get all projects of current user
router.get('/',
	auth,
	getProjects,
);

// update project
router.put('/:id',
	auth,
	[
		check('name', 'Name is required').not().isEmpty()
	],
	updateProject,
);

// delete project
router.delete('/:id',
	auth,
	deleteProject,
);

export const projectsRouter: Router = router;