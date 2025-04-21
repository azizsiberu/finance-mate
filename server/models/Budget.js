const supabase = require('../config/supabase');

class Budget {
  /**
   * Create a new budget
   * @param {string} userId - User ID
   * @param {object} budgetData - Budget data
   * @returns {Promise<object>} - Created budget
   */
  static async create(userId, budgetData) {
    try {
      const {
        name,
        amount,
        period,
        category,
        startDate,
        endDate,
        isRecurring,
        recurringPeriod,
        isShared,
        notes
      } = budgetData;

      // Check if there's an existing budget with same name and period
      const existingBudget = await Budget.findByName(userId, name, period);
      if (existingBudget) {
        throw new Error('Budget with this name already exists for the selected period');
      }

      // Create budget
      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: userId,
            name,
            amount: parseFloat(amount),
            period,
            category,
            start_date: startDate,
            end_date: endDate,
            is_recurring: isRecurring || false,
            recurring_period: recurringPeriod,
            is_shared: isShared || false,
            notes: notes || '',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);

      // If budget is shared and user has partner, create a copy for partner
      if (isShared) {
        const { data: user } = await supabase
          .from('users')
          .select('partner_id')
          .eq('id', userId)
          .single();

        if (user && user.partner_id) {
          await supabase
            .from('budgets')
            .insert([
              {
                user_id: user.partner_id,
                name,
                amount: parseFloat(amount),
                period,
                category,
                start_date: startDate,
                end_date: endDate,
                is_recurring: isRecurring || false,
                recurring_period: recurringPeriod,
                is_shared: true,
                notes: notes || '',
                created_at: new Date().toISOString(),
                shared_from: data.id
              }
            ]);
        }
      }

      return data;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  }

  /**
   * Get a budget by ID
   * @param {string} userId - User ID
   * @param {string} budgetId - Budget ID
   * @returns {Promise<object|null>} - Budget or null if not found
   */
  static async findById(userId, budgetId) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Find budget error:', error);
      throw error;
    }
  }

  /**
   * Find a budget by name and period
   * @param {string} userId - User ID
   * @param {string} name - Budget name
   * @param {string} period - Budget period (monthly, yearly, custom)
   * @returns {Promise<object|null>} - Budget or null if not found
   */
  static async findByName(userId, name, period) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('name', name)
        .eq('period', period)
        .maybeSingle();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Find budget by name error:', error);
      throw error;
    }
  }

  /**
   * Get all budgets for a user with optional filters
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} - Budgets with spending data
   */
  static async findAll(userId, filters = {}) {
    try {
      const {
        category,
        period,
        isRecurring,
        isShared,
        isActive,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = filters;

      // Get budgets
      let query = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (category) {
        query = query.eq('category', category);
      }

      if (period) {
        query = query.eq('period', period);
      }

      if (isRecurring !== undefined) {
        query = query.eq('is_recurring', isRecurring);
      }

      if (isShared !== undefined) {
        query = query.eq('is_shared', isShared);
      }

      // Filter for active budgets
      if (isActive === true) {
        const today = new Date().toISOString().split('T')[0];
        query = query.or(`end_date.gte.${today},end_date.is.null`);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data: budgets, error } = await query;

      if (error) throw new Error(error.message);

      // Get transactions within budget periods to calculate current spending
      const enrichedBudgets = await Promise.all(budgets.map(async budget => {
        const currentSpending = await Budget.calculateSpending(userId, budget);
        const percentUsed = budget.amount > 0 
          ? Math.round((currentSpending / budget.amount) * 100) 
          : 0;
        
        return {
          ...budget,
          currentSpending,
          percentUsed,
          status: Budget.getBudgetStatus(percentUsed)
        };
      }));

      return enrichedBudgets;
    } catch (error) {
      console.error('Find all budgets error:', error);
      throw error;
    }
  }

  /**
   * Calculate current spending for a budget
   * @param {string} userId - User ID
   * @param {object} budget - Budget object
   * @returns {Promise<number>} - Current spending amount
   */
  static async calculateSpending(userId, budget) {
    try {
      let query = supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'expense');

      // Filter by category if specified
      if (budget.category && budget.category !== 'All') {
        query = query.eq('category', budget.category);
      }

      // Filter by date range
      query = query.gte('transaction_date', budget.start_date);
      if (budget.end_date) {
        query = query.lte('transaction_date', budget.end_date);
      }

      const { data: transactions, error } = await query;

      if (error) throw new Error(error.message);

      // Sum up the expenses
      const totalSpending = transactions.reduce(
        (sum, tx) => sum + parseFloat(tx.amount),
        0
      );

      return parseFloat(totalSpending.toFixed(2));
    } catch (error) {
      console.error('Calculate spending error:', error);
      throw error;
    }
  }

  /**
   * Determine budget status based on percent used
   * @param {number} percentUsed - Percentage of budget used
   * @returns {string} - Budget status (good, warning, danger, exceeded)
   */
  static getBudgetStatus(percentUsed) {
    if (percentUsed <= 50) return 'good';
    if (percentUsed <= 75) return 'warning';
    if (percentUsed <= 100) return 'danger';
    return 'exceeded';
  }

  /**
   * Update a budget
   * @param {string} userId - User ID
   * @param {string} budgetId - Budget ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated budget
   */
  static async update(userId, budgetId, updateData) {
    try {
      // Check if budget exists and belongs to user
      const existingBudget = await Budget.findById(userId, budgetId);
      if (!existingBudget) {
        throw new Error('Budget not found');
      }

      // Check if name is being updated and if it conflicts
      if (updateData.name && 
          updateData.name !== existingBudget.name && 
          updateData.period) {
        const existing = await Budget.findByName(
          userId, 
          updateData.name, 
          updateData.period || existingBudget.period
        );
        
        if (existing && existing.id !== budgetId) {
          throw new Error('Budget with this name already exists for the selected period');
        }
      }

      // Prepare update data
      const updates = {};
      
      if (updateData.name) updates.name = updateData.name;
      if (updateData.amount !== undefined) updates.amount = parseFloat(updateData.amount);
      if (updateData.period) updates.period = updateData.period;
      if (updateData.category) updates.category = updateData.category;
      if (updateData.startDate) updates.start_date = updateData.startDate;
      if (updateData.endDate) updates.end_date = updateData.endDate;
      if (updateData.isRecurring !== undefined) updates.is_recurring = updateData.isRecurring;
      if (updateData.recurringPeriod) updates.recurring_period = updateData.recurringPeriod;
      if (updateData.notes !== undefined) updates.notes = updateData.notes;

      // Update budget
      const { data: updatedBudget, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', budgetId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Update shared budget if necessary
      if (existingBudget.is_shared || 
          (updateData.isShared !== undefined && updateData.isShared)) {
        
        // Update shared copy if this is the original
        if (!existingBudget.shared_from) {
          await supabase
            .from('budgets')
            .update(updates)
            .eq('shared_from', budgetId);
        } 
        // Update original if this is a copy
        else if (existingBudget.shared_from) {
          await supabase
            .from('budgets')
            .update(updates)
            .eq('id', existingBudget.shared_from);
        }
      }

      // Calculate current metrics
      const currentSpending = await Budget.calculateSpending(userId, updatedBudget);
      const percentUsed = updatedBudget.amount > 0 
        ? Math.round((currentSpending / updatedBudget.amount) * 100) 
        : 0;

      return {
        ...updatedBudget,
        currentSpending,
        percentUsed,
        status: Budget.getBudgetStatus(percentUsed)
      };
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  }

  /**
   * Delete a budget
   * @param {string} userId - User ID
   * @param {string} budgetId - Budget ID
   * @param {boolean} deleteShared - Whether to delete shared copies/original
   * @returns {Promise<boolean>} - True if successful
   */
  static async delete(userId, budgetId, deleteShared = false) {
    try {
      // Check if budget exists and belongs to user
      const budget = await Budget.findById(userId, budgetId);
      if (!budget) {
        throw new Error('Budget not found');
      }

      // Delete budget
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);

      // Handle shared budgets if requested
      if (deleteShared && budget.is_shared) {
        if (budget.shared_from) {
          // This is a copy, delete original
          await supabase
            .from('budgets')
            .delete()
            .eq('id', budget.shared_from);
        } else {
          // This is original, delete copies
          await supabase
            .from('budgets')
            .delete()
            .eq('shared_from', budgetId);
        }
      }

      return true;
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }

  /**
   * Get budget summary with progress details
   * @param {string} userId - User ID 
   * @returns {Promise<Array>} - Budget summary
   */
  static async getSummary(userId) {
    try {
      // Get active budgets
      const today = new Date().toISOString().split('T')[0];
      const { data: activeBudgets, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .or(`end_date.gte.${today},end_date.is.null`);

      if (error) throw new Error(error.message);

      // Calculate metrics for each active budget
      const budgetsWithMetrics = await Promise.all(activeBudgets.map(async budget => {
        const currentSpending = await Budget.calculateSpending(userId, budget);
        const percentUsed = budget.amount > 0 
          ? Math.round((currentSpending / budget.amount) * 100) 
          : 0;
        const remaining = parseFloat((budget.amount - currentSpending).toFixed(2));
        const status = Budget.getBudgetStatus(percentUsed);

        // Calculate daily budget
        let daysInPeriod = 30; // Default for monthly
        
        if (budget.period === 'yearly') {
          daysInPeriod = 365;
        } else if (budget.period === 'weekly') {
          daysInPeriod = 7;
        } else if (budget.period === 'custom' && budget.start_date && budget.end_date) {
          const startDate = new Date(budget.start_date);
          const endDate = new Date(budget.end_date);
          daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        }

        const daysRemaining = budget.end_date 
          ? Math.ceil((new Date(budget.end_date) - new Date()) / (1000 * 60 * 60 * 24)) + 1
          : daysInPeriod;

        const dailyBudget = parseFloat((remaining / Math.max(daysRemaining, 1)).toFixed(2));

        return {
          id: budget.id,
          name: budget.name,
          category: budget.category,
          period: budget.period,
          amount: budget.amount,
          currentSpending,
          remaining,
          percentUsed,
          status,
          startDate: budget.start_date,
          endDate: budget.end_date,
          daysInPeriod,
          daysRemaining: Math.max(daysRemaining, 0),
          dailyBudget: dailyBudget > 0 ? dailyBudget : 0,
          isShared: budget.is_shared
        };
      }));

      return budgetsWithMetrics;
    } catch (error) {
      console.error('Get budget summary error:', error);
      throw error;
    }
  }
}

module.exports = Budget;