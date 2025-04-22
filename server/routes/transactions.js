const express = require('express');
const router = express.Router();
const multer = require('multer');
const TransactionController = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');
const { validateTransaction } = require('../middlewares/validation');

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    // Accept only CSV files
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Create a new transaction
router.post('/', authenticate, validateTransaction, TransactionController.createTransaction);

// Import transactions from CSV
router.post('/import', authenticate, upload.single('file'), TransactionController.importTransactions);

// Export transactions to CSV
router.get('/export', authenticate, TransactionController.exportTransactions);

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