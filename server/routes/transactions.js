const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');
const { validateTransaction } = require('../middlewares/validation');

// Create a new transaction
router.post('/', authenticate, validateTransaction, TransactionController.createTransaction);

// Get all transactions for current user
router.get('/', authenticate, TransactionController.getAllTransactions);

// Get transaction by ID
router.get('/:id', authenticate, TransactionController.getTransactionById);

// Update transaction
router.put('/:id', authenticate, TransactionController.updateTransaction);

// Delete transaction
router.delete('/:id', authenticate, TransactionController.deleteTransaction);

// Get transaction statistics by category
router.get('/stats/by-category', authenticate, TransactionController.getStatsByCategory);

// Get monthly transaction statistics
router.get('/stats/by-month', authenticate, TransactionController.getMonthlyStats);

// Get transaction summary for a period
router.get('/stats/summary', authenticate, TransactionController.getSummary);

module.exports = router;