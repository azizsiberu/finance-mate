const Budget = require('../models/Budget');
const User = require('../models/User');

class BudgetController {
  /**
   * Create a new budget
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createBudget(req, res) {
    try {
      const {
        category,
        amount,
        period,
        startDate,
        endDate,
        isRecurring,
        isShared,
        description
      } = req.body;
      
      const userId = req.user.userId;

      // Create budget
      const budget = await Budget.create({
        userId,
        category,
        amount,
        period,
        startDate,
        endDate,
        isRecurring,
        isShared,
        description
      });

      // If budget is shared and user has a partner, create a copy for the partner
      if (isShared) {
        const user = await User.findById(userId);
        
        if (user && user.partner_id) {
          await Budget.create({
            userId: user.partner_id,
            category,
            amount,
            period,
            startDate,
            endDate,
            isRecurring,
            isShared: true,
            description
          });
        }
      }

      res.status(201).json({ 
        message: 'Budget created successfully', 
        budget 
      });
    } catch (error) {
      console.error('Budget creation error:', error);
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }

  /**
   * Get all budgets with optional filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllBudgets(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        category: req.query.category,
        period: req.query.period,
        isRecurring: req.query.isRecurring === 'true',
        isActive: req.query.isActive === 'true',
        isShared: req.query.isShared === 'true',
        sortBy: req.query.sortBy || 'start_date',
        sortOrder: req.query.sortOrder || 'desc'
      };

      // Convert undefined values to undefined (not string 'undefined')
      Object.keys(filters).forEach(key => {
        if (filters[key] === 'undefined') {
          delete filters[key];
        }
      });

      const budgets = await Budget.findAll(userId, filters);

      res.status(200).json({ budgets });
    } catch (error) {
      console.error('Get budgets error:', error);
      res.status(500).json({ error: 'Failed to get budgets' });
    }
  }

  /**
   * Get a budget by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getBudgetById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const budget = await Budget.findById(id, userId);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      res.status(200).json({ budget });
    } catch (error) {
      console.error('Get budget error:', error);
      res.status(500).json({ error: 'Failed to get budget' });
    }
  }

  /**
   * Update a budget
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const {
        category,
        amount,
        period,
        startDate,
        endDate,
        isRecurring,
        isShared,
        description
      } = req.body;

      // Check if budget exists and belongs to user
      const existingBudget = await Budget.findById(id, userId);

      if (!existingBudget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      // Update budget
      const updatedBudget = await Budget.update(id, userId, {
        category,
        amount,
        period,
        startDate,
        endDate,
        isRecurring,
        isShared,
        description
      });

      res.status(200).json({ 
        message: 'Budget updated successfully', 
        budget: updatedBudget 
      });
    } catch (error) {
      console.error('Update budget error:', error);
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }

  /**
   * Delete a budget
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteBudget(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if budget exists and belongs to user
      const budget = await Budget.findById(id, userId);

      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }

      // Delete budget
      await Budget.delete(id, userId);

      res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
      console.error('Delete budget error:', error);
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  }

  /**
   * Get budget progress
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getBudgetProgress(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        category: req.query.category,
        period: req.query.period,
        isShared: req.query.isShared === 'true'
      };

      // Convert undefined values to undefined (not string 'undefined')
      Object.keys(filters).forEach(key => {
        if (filters[key] === 'undefined') {
          delete filters[key];
        }
      });

      const budgetProgress = await Budget.getBudgetProgress(userId, filters);

      res.status(200).json({ budgets: budgetProgress });
    } catch (error) {
      console.error('Budget progress error:', error);
      res.status(500).json({ error: 'Failed to get budget progress' });
    }
  }
  
  /**
   * Create a recurring budget for a new period
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async renewRecurringBudget(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      // Check if budget exists, belongs to user, and is recurring
      const budget = await Budget.findById(id, userId);
      
      if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      
      if (!budget.is_recurring) {
        return res.status(400).json({ error: 'Budget is not recurring' });
      }
      
      // Create new recurring budget
      const newBudget = await Budget.createRecurringBudget(budget);
      
      res.status(201).json({
        message: 'Recurring budget renewed',
        budget: newBudget
      });
    } catch (error) {
      console.error('Renew recurring budget error:', error);
      res.status(500).json({ error: 'Failed to renew recurring budget' });
    }
  }
}

module.exports = BudgetController;