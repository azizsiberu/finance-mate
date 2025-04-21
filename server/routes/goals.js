const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const goalController = require('../controllers/goalController');

// Create a new financial goal
router.post('/', authenticate, goalController.createGoal);

// Get all financial goals for current user
router.get('/', authenticate, goalController.getAllGoals);

// Get financial goal by ID
router.get('/:id', authenticate, goalController.getGoalById);

// Update financial goal
router.put('/:id', authenticate, goalController.updateGoal);

// Delete financial goal
router.delete('/:id', authenticate, goalController.deleteGoal);

// Add contribution to a goal
router.post('/:id/contribute', authenticate, goalController.addContribution);

module.exports = router;