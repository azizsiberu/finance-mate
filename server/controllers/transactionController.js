const Transaction = require('../models/Transaction');
const User = require('../models/User');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const moment = require('moment');

class TransactionController {
  /**
   * Create a new transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createTransaction(req, res) {
    try {
      const {
        amount,
        type,
        category,
        description,
        date,
        isShared,
        tags
      } = req.body;
      
      const userId = req.user.userId;

      // Create transaction
      const transaction = await Transaction.create({
        userId,
        amount,
        type,
        category,
        description,
        date,
        isShared,
        tags
      });

      // If transaction is shared and user has a partner, create a copy for the partner
      if (isShared) {
        const user = await User.findById(userId);
        
        if (user && user.partner_id) {
          await Transaction.create({
            userId: user.partner_id,
            amount,
            type,
            category,
            description,
            date,
            isShared: true,
            tags,
            sharedFrom: transaction.id
          });
        }
      }

      res.status(201).json({ 
        message: 'Transaction created successfully', 
        transaction 
      });
    } catch (error) {
      console.error('Transaction creation error:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }

  /**
   * Get all transactions with optional filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllTransactions(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type,
        category: req.query.category,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount,
        isShared: req.query.isShared,
        tags: req.query.tags,
        search: req.query.search,
        sortBy: req.query.sortBy || 'transaction_date',
        sortOrder: req.query.sortOrder || 'desc',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };

      const result = await Transaction.findAll(userId, filters);

      // Calculate statistics for current filter
      const statsFilters = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        category: filters.category,
        isShared: filters.isShared
      };

      let totalIncome = 0;
      let totalExpense = 0;

      // Get transactions for income/expense calculations
      const incomeTransactions = await Transaction.getStatsByCategory(userId, {
        ...statsFilters,
        type: 'income'
      });
      
      const expenseTransactions = await Transaction.getStatsByCategory(userId, {
        ...statsFilters,
        type: 'expense'
      });

      // Calculate totals
      if (incomeTransactions.length) {
        totalIncome = incomeTransactions.reduce((sum, item) => sum + item.amount, 0);
      }
      
      if (expenseTransactions.length) {
        totalExpense = expenseTransactions.reduce((sum, item) => sum + item.amount, 0);
      }

      res.status(200).json({ 
        ...result,
        stats: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }

  /**
   * Get a transaction by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const transaction = await Transaction.findById(id, userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.status(200).json({ transaction });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({ error: 'Failed to get transaction' });
    }
  }

  /**
   * Update a transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const {
        amount,
        type,
        category,
        description,
        date,
        isShared,
        tags
      } = req.body;

      // Check if transaction exists and belongs to user
      const existingTransaction = await Transaction.findById(id, userId);

      if (!existingTransaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Update transaction
      const updatedTransaction = await Transaction.update(id, userId, {
        amount,
        type,
        category,
        description,
        date,
        isShared,
        tags
      });

      // If transaction is shared, update the shared transaction if necessary
      if (existingTransaction.shared_from || 
          existingTransaction.is_shared || 
          isShared !== undefined) {

        const user = await User.findById(userId);

        if (user && user.partner_id) {
          if (existingTransaction.shared_from) {
            // Update the original transaction if this is a shared copy
            await Transaction.update(existingTransaction.shared_from, user.partner_id, {
              amount,
              type,
              category,
              description,
              date,
              tags
            });
          } else if (existingTransaction.is_shared || isShared) {
            // Update any shared copies of this transaction
            const sharedTransactions = await Transaction.findBySharedId(id);
            
            if (sharedTransactions && sharedTransactions.length > 0) {
              for (const sharedTx of sharedTransactions) {
                await Transaction.update(sharedTx.id, sharedTx.user_id, {
                  amount,
                  type,
                  category,
                  description,
                  date,
                  tags
                });
              }
            }
          }
        }
      }

      res.status(200).json({ 
        message: 'Transaction updated successfully', 
        transaction: updatedTransaction 
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }

  /**
   * Delete a transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { deleteOriginal } = req.query;

      // Check if transaction exists and belongs to user
      const transaction = await Transaction.findById(id, userId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Delete transaction
      await Transaction.delete(id, userId);

      // If transaction is shared, handle related transactions
      if (transaction.is_shared || transaction.shared_from) {
        if (transaction.shared_from && deleteOriginal === 'true') {
          // This is a shared copy, delete original if requested
          await Transaction.delete(transaction.shared_from, transaction.user_id);
        } else if (transaction.is_shared) {
          // This is an original, delete all shared copies
          const sharedTransactions = await Transaction.findBySharedId(id);
          
          if (sharedTransactions && sharedTransactions.length > 0) {
            for (const sharedTx of sharedTransactions) {
              await Transaction.delete(sharedTx.id, sharedTx.user_id);
            }
          }
        }
      }

      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  }

  /**
   * Get transaction statistics by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStatsByCategory(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type || 'expense',
        isShared: req.query.isShared
      };

      const stats = await Transaction.getStatsByCategory(userId, filters);

      res.status(200).json({ stats });
    } catch (error) {
      console.error('Transaction statistics error:', error);
      res.status(500).json({ error: 'Failed to get transaction statistics' });
    }
  }

  /**
   * Get monthly transaction statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getMonthlyStats(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        year: parseInt(req.query.year) || new Date().getFullYear(),
        type: req.query.type,
        category: req.query.category,
        isShared: req.query.isShared
      };

      const monthlyStats = await Transaction.getMonthlyStats(userId, filters);

      res.status(200).json({ monthlyStats });
    } catch (error) {
      console.error('Monthly statistics error:', error);
      res.status(500).json({ error: 'Failed to get monthly statistics' });
    }
  }

  /**
   * Get transaction summary for a period
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSummary(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      if (!filters.startDate || !filters.endDate) {
        return res.status(400).json({ error: 'Start and end dates are required' });
      }

      const summary = await Transaction.getSummary(userId, filters);

      res.status(200).json(summary);
    } catch (error) {
      console.error('Summary error:', error);
      res.status(500).json({ error: 'Failed to get transaction summary' });
    }
  }

  /**
   * Import transactions from CSV file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async importTransactions(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.userId;
      const { skipFirstRow = 'true', dateFormat = 'YYYY-MM-DD' } = req.body;
      const skipHeader = skipFirstRow === 'true';
      
      const results = [];
      const errors = [];
      let rowCount = 0;

      // Create a temporary file path
      const csvFilePath = req.file.path;
      
      // Parse the CSV file
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          rowCount++;
          
          // Skip header row if specified
          if (skipHeader && rowCount === 1) {
            return;
          }

          // Map CSV columns to transaction fields
          // Customize this mapping based on your CSV structure
          try {
            const transaction = {
              userId,
              amount: parseFloat(data.amount || data.Amount || data.AMOUNT || 0),
              type: (data.type || data.Type || data.TYPE || '').toLowerCase() === 'income' ? 'income' : 'expense',
              category: data.category || data.Category || data.CATEGORY || 'Uncategorized',
              description: data.description || data.Description || data.DESCRIPTION || '',
              date: moment(data.date || data.Date || data.DATE, dateFormat).format('YYYY-MM-DD'),
              isShared: false,
              tags: data.tags || data.Tags || data.TAGS || ''
            };

            // Validate transaction data
            if (isNaN(transaction.amount) || transaction.amount <= 0) {
              throw new Error(`Invalid amount on row ${rowCount}`);
            }

            if (!moment(transaction.date, 'YYYY-MM-DD').isValid()) {
              throw new Error(`Invalid date format on row ${rowCount}`);
            }

            results.push(transaction);
          } catch (error) {
            errors.push(`Row ${rowCount}: ${error.message}`);
          }
        })
        .on('end', async () => {
          // Delete the temporary file
          fs.unlinkSync(csvFilePath);
          
          if (results.length === 0) {
            return res.status(400).json({ 
              message: 'No valid transactions found in the CSV file',
              errors
            });
          }

          try {
            // Batch insert transactions
            const insertedTransactions = await Transaction.bulkCreate(userId, results);
            
            res.status(201).json({ 
              message: `Successfully imported ${results.length} transactions`,
              successCount: results.length,
              errorCount: errors.length,
              errors: errors.length > 0 ? errors : [],
              transactions: insertedTransactions
            });
          } catch (err) {
            console.error('Import error:', err);
            res.status(500).json({ 
              error: 'Failed to import transactions',
              message: err.message
            });
          }
        })
        .on('error', (err) => {
          // Delete the temporary file
          if (fs.existsSync(csvFilePath)) {
            fs.unlinkSync(csvFilePath);
          }
          
          console.error('CSV parsing error:', err);
          res.status(500).json({ 
            error: 'Failed to parse CSV file',
            message: err.message
          });
        });
    } catch (error) {
      console.error('Import error:', error);
      
      // Clean up temporary file if it exists
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        error: 'Failed to import transactions',
        message: error.message
      });
    }
  }

  /**
   * Export transactions to CSV file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async exportTransactions(req, res) {
    try {
      const userId = req.user.userId;
      const { 
        startDate,
        endDate,
        type,
        category,
        format = 'csv' // Default format is CSV
      } = req.query;

      // Create filters for transactions
      const filters = { 
        startDate, 
        endDate, 
        type, 
        category,
        // Always include all transactions regardless of pagination
        page: 1,
        limit: 10000
      };

      // Get transactions based on filters
      const { transactions } = await Transaction.findAll(userId, filters);

      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ 
          error: 'No transactions found for the specified criteria' 
        });
      }

      // Standardize transactions for export
      const formattedTransactions = transactions.map(transaction => ({
        Date: transaction.transaction_date,
        Type: transaction.type,
        Category: transaction.category,
        Amount: transaction.amount,
        Description: transaction.description || '',
        Tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : transaction.tags || ''
      }));

      // Generate a filename with current date
      const dateStr = moment().format('YYYY-MM-DD');
      const filename = `transactions_export_${dateStr}.csv`;

      // Create a temporary directory if it doesn't exist
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Path for the export file
      const filePath = path.join(tempDir, filename);

      // Create a CSV writer
      const csvWriter = createCsvWriter({
        path: filePath,
        header: [
          { id: 'Date', title: 'Date' },
          { id: 'Type', title: 'Type' },
          { id: 'Category', title: 'Category' },
          { id: 'Amount', title: 'Amount' },
          { id: 'Description', title: 'Description' },
          { id: 'Tags', title: 'Tags' }
        ]
      });
      
      // Write data to CSV
      await csvWriter.writeRecords(formattedTransactions);

      // Send the file as a download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      
      // Stream the file to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      // Delete the file after sending
      fileStream.on('end', () => {
        fs.unlinkSync(filePath);
      });
      
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ 
        error: 'Failed to export transactions',
        message: error.message
      });
    }
  }
}

module.exports = TransactionController;