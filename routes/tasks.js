const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// create a new task
// @route   POST api/tasks
router.post('/',
	auth,
	[
		check('name', 'Name is required').not().isEmpty(),
		check('project', 'Project is required').not().isEmpty()
	],
	taskController.createTask
);

// get tasks by project
router.get('/',
	auth,
	taskController.getTasksByProject
);

// update task
router.put('/:id',
	auth,
	taskController.updateTask
);

// delete task
router.delete('/:id',
	auth,
	taskController.deleteTask
);

module.exports = router;