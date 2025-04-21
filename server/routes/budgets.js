const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budgetController');
const { authenticate } = require('../middlewares/auth');
const { validateBudget } = require('../middlewares/validation');

// Create a new budget
router.post('/', authenticate, validateBudget, BudgetController.createBudget);

// Get all budgets for current user
router.get('/', authenticate, BudgetController.getAllBudgets);

// Get budget by ID
router.get('/:id', authenticate, BudgetController.getBudgetById);

// Update budget
router.put('/:id', authenticate, BudgetController.updateBudget);

// Delete budget
router.delete('/:id', authenticate, BudgetController.deleteBudget);

// Get budget progress
router.get('/progress', authenticate, BudgetController.getBudgetProgress);

// Renew recurring budget
router.post('/:id/renew', authenticate, BudgetController.renewRecurringBudget);

module.exports = router;