const supabase = require('../config/supabase');

class Goal {
  /**
   * Create a new financial goal
   * @param {object} goalData - Goal data
   * @returns {Promise<object>} - Created goal
   */
  static async create(goalData) {
    try {
      const {
        userId,
        name,
        targetAmount,
        currentAmount,
        targetDate,
        description,
        category,
        priority
      } = goalData;

      const { data: goal, error } = await supabase
        .from('goals')
        .insert([{
          user_id: userId,
          name,
          target_amount: parseFloat(targetAmount),
          current_amount: parseFloat(currentAmount) || 0,
          target_date: targetDate,
          description: description || null,
          category: category || null,
          priority: priority || 'medium',
          status: 'in_progress'
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return goal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  /**
   * Get all goals for a user
   * @param {string} userId - User ID
   * @param {object} filters - Filter parameters
   * @returns {Promise<Array>} - Array of goals with progress data
   */
  static async findAll(userId, filters = {}) {
    try {
      const {
        status,
        category,
        sortBy = 'target_date',
        sortOrder = 'asc'
      } = filters;

      // Start query
      let query = supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data: goals, error } = await query;
      
      if (error) throw new Error(error.message);

      // Calculate additional fields and return
      const today = new Date();
      
      return goals.map(goal => {
        // Calculate progress percentage
        const progress = goal.target_amount > 0 
          ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
          : 0;
        
        // Calculate days remaining
        const targetDate = new Date(goal.target_date);
        const diffTime = targetDate - today;
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate amount needed per day to reach goal
        const amountNeeded = goal.target_amount - goal.current_amount;
        const dailyAmount = daysRemaining > 0 
          ? amountNeeded / daysRemaining 
          : amountNeeded;
        
        return {
          ...goal,
          progress: parseFloat(progress.toFixed(2)),
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          amountNeeded: parseFloat(amountNeeded.toFixed(2)),
          dailyAmount: parseFloat(dailyAmount.toFixed(2))
        };
      });
    } catch (error) {
      console.error('Error finding goals:', error);
      throw error;
    }
  }

  /**
   * Get goal by ID
   * @param {string} id - Goal ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} - Goal or null
   */
  static async findById(id, userId) {
    try {
      const { data: goal, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;

      // Calculate progress and other metrics
      const today = new Date();
      const targetDate = new Date(goal.target_date);
      const diffTime = targetDate - today;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const progress = goal.target_amount > 0 
        ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
        : 0;
      
      const amountNeeded = goal.target_amount - goal.current_amount;
      const dailyAmount = daysRemaining > 0 
        ? amountNeeded / daysRemaining 
        : amountNeeded;

      return {
        ...goal,
        progress: parseFloat(progress.toFixed(2)),
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        amountNeeded: parseFloat(amountNeeded.toFixed(2)),
        dailyAmount: parseFloat(dailyAmount.toFixed(2))
      };
    } catch (error) {
      console.error('Error finding goal:', error);
      throw error;
    }
  }

  /**
   * Update goal
   * @param {string} id - Goal ID
   * @param {string} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated goal
   */
  static async update(id, userId, updateData) {
    try {
      // Check if goal exists
      const existing = await this.findById(id, userId);
      if (!existing) {
        throw new Error('Goal not found');
      }

      // Prepare update data with snake_case keys
      const updates = {};
      if (updateData.name !== undefined) updates.name = updateData.name;
      if (updateData.targetAmount !== undefined) updates.target_amount = parseFloat(updateData.targetAmount);
      if (updateData.currentAmount !== undefined) updates.current_amount = parseFloat(updateData.currentAmount);
      if (updateData.targetDate !== undefined) updates.target_date = updateData.targetDate;
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.category !== undefined) updates.category = updateData.category;
      if (updateData.priority !== undefined) updates.priority = updateData.priority;
      
      // Check if goal is achieved
      if (updateData.currentAmount !== undefined && 
          parseFloat(updateData.currentAmount) >= existing.target_amount) {
        updates.status = 'achieved';
      } else if (updateData.status !== undefined) {
        updates.status = updateData.status;
      }

      // Update goal
      const { data: goal, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // Calculate metrics
      const today = new Date();
      const targetDate = new Date(goal.target_date);
      const diffTime = targetDate - today;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const progress = goal.target_amount > 0 
        ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
        : 0;
      
      const amountNeeded = goal.target_amount - goal.current_amount;
      const dailyAmount = daysRemaining > 0 
        ? amountNeeded / daysRemaining 
        : amountNeeded;
      
      return {
        ...goal,
        progress: parseFloat(progress.toFixed(2)),
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        amountNeeded: parseFloat(amountNeeded.toFixed(2)),
        dailyAmount: parseFloat(dailyAmount.toFixed(2))
      };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  /**
   * Delete goal
   * @param {string} id - Goal ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id, userId) {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  /**
   * Contribute amount to a goal
   * @param {string} id - Goal ID
   * @param {string} userId - User ID
   * @param {number} amount - Amount to contribute
   * @returns {Promise<object>} - Updated goal
   */
  static async contribute(id, userId, amount) {
    try {
      // Get current goal
      const goal = await this.findById(id, userId);
      if (!goal) {
        throw new Error('Goal not found');
      }

      const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
      const status = newAmount >= goal.target_amount ? 'achieved' : 'in_progress';

      // Update goal
      return await this.update(id, userId, {
        currentAmount: newAmount,
        status
      });
    } catch (error) {
      console.error('Error contributing to goal:', error);
      throw error;
    }
  }

  /**
   * Get goals summary
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Goals summary stats
   */
  static async getSummary(userId) {
    try {
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);

      // Initialize summary object
      const summary = {
        total: goals.length,
        achieved: 0,
        inProgress: 0,
        failed: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        progress: 0,
        categories: {}
      };

      // Process each goal
      goals.forEach(goal => {
        // Count by status
        if (goal.status === 'achieved') {
          summary.achieved++;
        } else if (goal.status === 'in_progress') {
          summary.inProgress++;
        } else if (goal.status === 'failed') {
          summary.failed++;
        }

        // Track amount totals
        summary.totalTargetAmount += parseFloat(goal.target_amount);
        summary.totalCurrentAmount += parseFloat(goal.current_amount);

        // Track by category
        const category = goal.category || 'Uncategorized';
        if (!summary.categories[category]) {
          summary.categories[category] = {
            count: 0,
            targetAmount: 0,
            currentAmount: 0
          };
        }

        summary.categories[category].count++;
        summary.categories[category].targetAmount += parseFloat(goal.target_amount);
        summary.categories[category].currentAmount += parseFloat(goal.current_amount);
      });

      // Calculate overall progress
      summary.progress = summary.totalTargetAmount > 0
        ? parseFloat(((summary.totalCurrentAmount / summary.totalTargetAmount) * 100).toFixed(2))
        : 0;

      // Calculate category progress
      Object.keys(summary.categories).forEach(category => {
        const cat = summary.categories[category];
        cat.progress = cat.targetAmount > 0
          ? parseFloat(((cat.currentAmount / cat.targetAmount) * 100).toFixed(2))
          : 0;
      });

      return summary;
    } catch (error) {
      console.error('Error getting goals summary:', error);
      throw error;
    }
  }
}

module.exports = Goal;