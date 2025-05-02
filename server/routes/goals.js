const express = require('express');
const multer = require('multer');
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();
const upload = multer(); // Middleware for handling multipart/form-data

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

// Route to upload a file for a goal
router.post('/:goalId/upload-file', authenticate, upload.single('goalFile'), goalController.uploadGoalFile);

module.exports = router;