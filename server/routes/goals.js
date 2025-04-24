const express = require('express');
const multer = require('multer');
const { uploadGoalFile } = require('../controllers/goalController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const upload = multer(); // Middleware for handling multipart/form-data

// Create a new financial goal
router.post('/', authMiddleware, goalController.createGoal);

// Get all financial goals for current user
router.get('/', authMiddleware, goalController.getAllGoals);

// Get financial goal by ID
router.get('/:id', authMiddleware, goalController.getGoalById);

// Update financial goal
router.put('/:id', authMiddleware, goalController.updateGoal);

// Delete financial goal
router.delete('/:id', authMiddleware, goalController.deleteGoal);

// Add contribution to a goal
router.post('/:id/contribute', authMiddleware, goalController.addContribution);

// Route to upload a file for a goal
router.post('/:goalId/upload-file', authMiddleware, upload.single('goalFile'), uploadGoalFile);

module.exports = router;