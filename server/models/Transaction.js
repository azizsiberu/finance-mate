const supabase = require('../config/supabase');

class Transaction {
  /**
   * Create a new transaction
   * @param {object} transactionData - Transaction data
   * @returns {Promise<object>} - Created transaction
   */
  static async create(transactionData) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: transactionData.userId,
          amount: parseFloat(transactionData.amount),
          type: transactionData.type,
          category: transactionData.category,
          description: transactionData.description || '',
          transaction_date: transactionData.date,
          is_shared: transactionData.isShared || false,
          tags: transactionData.tags || [],
          shared_from: transactionData.sharedFrom || null
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Find a transaction by ID for a specific user
   * @param {string} id - Transaction ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} - Transaction data or null
   */
  static async findById(id, userId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding transaction:', error);
      throw error;
    }
  }

  /**
   * Get all transactions for a user with filters
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<object>} - Transactions and pagination info
   */
  static async findAll(userId, filters = {}) {
    try {
      const {
        startDate,
        endDate,
        type,
        category,
        minAmount,
        maxAmount,
        isShared,
        tags,
        search,
        sortBy = 'transaction_date',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = filters;

      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (startDate) query = query.gte('transaction_date', startDate);
      if (endDate) query = query.lte('transaction_date', endDate);
      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category', category);
      if (minAmount) query = query.gte('amount', parseFloat(minAmount));
      if (maxAmount) query = query.lte('amount', parseFloat(maxAmount));
      if (isShared !== undefined) query = query.eq('is_shared', isShared);
      if (tags && tags.length) query = query.contains('tags', Array.isArray(tags) ? tags : [tags]);
      if (search) query = query.ilike('description', `%${search}%`);

      // Add sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await query;

      if (error) throw new Error(error.message);

      return {
        transactions: data,
        totalCount: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error finding transactions:', error);
      throw error;
    }
  }

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {string} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated transaction
   */
  static async update(id, userId, updateData) {
    try {
      const updates = {};
      
      if (updateData.amount !== undefined) updates.amount = parseFloat(updateData.amount);
      if (updateData.type !== undefined) updates.type = updateData.type;
      if (updateData.category !== undefined) updates.category = updateData.category;
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.date !== undefined) updates.transaction_date = updateData.date;
      if (updateData.isShared !== undefined) updates.is_shared = updateData.isShared;
      if (updateData.tags !== undefined) updates.tags = updateData.tags;
      
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - True if successful
   */
  static async delete(id, userId) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  /**
   * Get transactions by shared ID
   * @param {string} sharedFromId - Original transaction ID
   * @returns {Promise<Array>} - Array of shared transactions
   */
  static async findBySharedId(sharedFromId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('shared_from', sharedFromId);
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error finding shared transactions:', error);
      throw error;
    }
  }

  /**
   * Get transaction statistics by category
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} - Statistics by category
   */
  static async getStatsByCategory(userId, filters = {}) {
    try {
      const {
        startDate,
        endDate,
        type = 'expense',
        isShared
      } = filters;

      let query = supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', userId)
        .eq('type', type);

      if (startDate) query = query.gte('transaction_date', startDate);
      if (endDate) query = query.lte('transaction_date', endDate);
      if (isShared !== undefined) query = query.eq('is_shared', isShared);

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      // Group by category
      const statsByCategory = data.reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = parseFloat(transaction.amount);
        
        if (!acc[category]) acc[category] = 0;
        acc[category] += amount;
        
        return acc;
      }, {});

      // Format for response
      return Object.keys(statsByCategory).map(category => ({
        category,
        amount: parseFloat(statsByCategory[category].toFixed(2))
      })).sort((a, b) => b.amount - a.amount);
    } catch (error) {
      console.error('Error getting transaction stats:', error);
      throw error;
    }
  }

  /**
   * Get monthly transaction statistics
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} - Monthly statistics
   */
  static async getMonthlyStats(userId, filters = {}) {
    try {
      const {
        year = new Date().getFullYear(),
        type,
        category,
        isShared
      } = filters;

      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      let query = supabase
        .from('transactions')
        .select('type, amount, transaction_date')
        .eq('user_id', userId)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      if (type) {
        query = query.eq('type', type);
      } else {
        query = query.in('type', ['income', 'expense']);
      }
      
      if (category) query = query.eq('category', category);
      if (isShared !== undefined) query = query.eq('is_shared', isShared);

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      // Initialize monthly stats
      const monthlyStats = Array(12).fill(0).map((_, index) => ({
        month: index + 1,
        income: 0,
        expense: 0,
        balance: 0
      }));

      // Group by month and type
      data.forEach(transaction => {
        const month = parseInt(transaction.transaction_date.split('-')[1]) - 1;
        const amount = parseFloat(transaction.amount);
        
        if (transaction.type === 'income') {
          monthlyStats[month].income += amount;
        } else if (transaction.type === 'expense') {
          monthlyStats[month].expense += amount;
        }
      });

      // Calculate balance and round values
      return monthlyStats.map(stat => ({
        month: stat.month,
        income: parseFloat(stat.income.toFixed(2)),
        expense: parseFloat(stat.expense.toFixed(2)),
        balance: parseFloat((stat.income - stat.expense).toFixed(2))
      }));
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      throw error;
    }
  }

  /**
   * Get transaction summary for a specific period
   * @param {string} userId - User ID
   * @param {object} filters - Filter options
   * @returns {Promise<object>} - Summary stats
   */
  static async getSummary(userId, filters = {}) {
    try {
      const { startDate, endDate } = filters;
      
      if (!startDate || !endDate) {
        throw new Error('Start and end dates are required');
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      // Calculate statistics
      let totalIncome = 0;
      let totalExpense = 0;
      const categoryTotals = {};
      const dailyTotals = {};
      
      data.forEach(tx => {
        // Update income/expense totals
        if (tx.type === 'income') {
          totalIncome += tx.amount;
        } else if (tx.type === 'expense') {
          totalExpense += tx.amount;
        }
        
        // Update category totals
        if (!categoryTotals[tx.category]) {
          categoryTotals[tx.category] = 0;
        }
        categoryTotals[tx.category] += Math.abs(tx.amount);
        
        // Update daily totals
        const date = tx.transaction_date.split('T')[0];
        if (!dailyTotals[date]) {
          dailyTotals[date] = { income: 0, expense: 0 };
        }
        
        if (tx.type === 'income') {
          dailyTotals[date].income += tx.amount;
        } else if (tx.type === 'expense') {
          dailyTotals[date].expense += tx.amount;
        }
      });
      
      // Convert dailyTotals to array
      const dailyData = Object.keys(dailyTotals).map(date => ({
        date,
        income: dailyTotals[date].income,
        expense: dailyTotals[date].expense,
        balance: dailyTotals[date].income - dailyTotals[date].expense
      }));
      
      // Convert categoryTotals to array
      const categoryData = Object.keys(categoryTotals).map(category => ({
        category,
        amount: categoryTotals[category]
      }));
      
      return {
        summary: {
          totalIncome: parseFloat(totalIncome.toFixed(2)),
          totalExpense: parseFloat(totalExpense.toFixed(2)),
          balance: parseFloat((totalIncome - totalExpense).toFixed(2))
        },
        categoryData,
        dailyData
      };
    } catch (error) {
      console.error('Error getting summary:', error);
      throw error;
    }
  }
}

module.exports = Transaction;