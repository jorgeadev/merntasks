const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// @route   POST api/projects
router.post('/',
	auth,
	[
		check('name', 'Name is required').not().isEmpty()
	],
	projectController.createProject
);

// get all projects of current user
router.get('/',
	auth,
	projectController.getProjects,
);

// update project
router.put('/:id',
	auth,
	[
		check('name', 'Name is required').not().isEmpty()
	],
	projectController.updateProject,
);

// delete project
router.delete('/:id',
	auth,
	projectController.deleteProject,
);

module.exports = router;