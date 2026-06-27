const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

// Task routes
router.route('/')
  .post(createTask)
  .get(getTasks);

// Get stats endpoint must be defined BEFORE /:id to prevent ID collisions
router.route('/stats')
  .get(getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
