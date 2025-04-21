const supabase = require('../config/supabase');

class Category {
  /**
   * Get all categories with usage statistics
   * @param {string} userId - User ID
   * @param {object} filters - Filter options (type, startDate, endDate, sortBy, sortOrder)
   * @returns {Promise<Array>} - Categories with usage statistics
   */
  static async getAllWithStats(userId, filters = {}) {
    try {
      const { type, startDate, endDate, sortBy = 'name', sortOrder = 'asc' } = filters;
      
      // Get all categories (system and user's custom categories)
      let query = supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${userId}`);
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data: categories, error } = await query;
      
      if (error) throw new Error(error.message);
      
      // Get transaction statistics for each category
      let txStatsQuery = supabase
        .from('transactions')
        .select('category, type, amount')
        .eq('user_id', userId);
        
      if (startDate) {
        txStatsQuery = txStatsQuery.gte('transaction_date', startDate);
      }
      
      if (endDate) {
        txStatsQuery = txStatsQuery.lte('transaction_date', endDate);
      }
      
      const { data: transactions, error: txError } = await txStatsQuery;
      
      if (txError) throw new Error(txError.message);
      
      // Calculate usage statistics for each category
      const categoryStats = {};
      
      transactions.forEach(tx => {
        if (!categoryStats[tx.category]) {
          categoryStats[tx.category] = {
            count: 0,
            totalAmount: 0,
            incomeAmount: 0,
            expenseAmount: 0,
            lastUsed: null
          };
        }
        
        const stats = categoryStats[tx.category];
        const amount = parseFloat(tx.amount);
        
        stats.count++;
        stats.totalAmount += amount;
        
        if (tx.type === 'income') {
          stats.incomeAmount += amount;
        } else if (tx.type === 'expense') {
          stats.expenseAmount += amount;
        }
        
        const txDate = new Date(tx.transaction_date);
        if (!stats.lastUsed || txDate > new Date(stats.lastUsed)) {
          stats.lastUsed = tx.transaction_date;
        }
      });
      
      // Merge category information with statistics
      const result = categories.map(category => {
        const stats = categoryStats[category.name] || {
          count: 0,
          totalAmount: 0,
          incomeAmount: 0,
          expenseAmount: 0,
          lastUsed: null
        };
        
        return {
          ...category,
          isSystem: category.user_id === null,
          usageCount: stats.count,
          totalAmount: parseFloat(stats.totalAmount.toFixed(2)),
          incomeAmount: parseFloat(stats.incomeAmount.toFixed(2)),
          expenseAmount: parseFloat(stats.expenseAmount.toFixed(2)),
          lastUsed: stats.lastUsed
        };
      });
      
      // Sort results
      const sortField = sortBy || 'name';
      const isAscending = (sortOrder || 'asc') === 'asc';
      
      result.sort((a, b) => {
        let comparison;
        
        if (sortField === 'usageCount') {
          comparison = a.usageCount - b.usageCount;
        } else if (sortField === 'totalAmount') {
          comparison = a.totalAmount - b.totalAmount;
        } else if (sortField === 'lastUsed') {
          // Handle null dates
          if (!a.lastUsed && !b.lastUsed) comparison = 0;
          else if (!a.lastUsed) comparison = 1;
          else if (!b.lastUsed) comparison = -1;
          else comparison = new Date(a.lastUsed) - new Date(b.lastUsed);
        } else {
          // Default to name
          comparison = a.name.localeCompare(b.name);
        }
        
        return isAscending ? comparison : -comparison;
      });
      
      return result;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Create a new custom category
   * @param {string} userId - User ID
   * @param {object} categoryData - Category data
   * @returns {Promise<object>} - Created category
   */
  static async create(userId, categoryData) {
    try {
      const { name, type, description, icon, color } = categoryData;
      
      // Check if category already exists
      const { data: existing, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${userId}`)
        .eq('name', name)
        .maybeSingle();
      
      if (checkError) throw new Error(checkError.message);
      
      if (existing) {
        throw new Error('Category with this name already exists');
      }
      
      // Create new category
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name,
            type: type || 'expense',
            description: description || '',
            icon: icon || 'default',
            color: color || '#000000',
            user_id: userId
          }
        ])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      return {
        ...data,
        isSystem: false
      };
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  /**
   * Update a custom category
   * @param {string} userId - User ID
   * @param {string} categoryId - Category ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated category
   */
  static async update(userId, categoryId, updateData) {
    try {
      // Check if category exists and belongs to user
      const { data: existing, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw new Error(checkError.message);
      
      if (!existing) {
        throw new Error('Category not found or cannot be edited');
      }
      
      // If name is being updated, check it doesn't conflict
      if (updateData.name && updateData.name !== existing.name) {
        const { data: nameCheck, error: nameError } = await supabase
          .from('categories')
          .select('*')
          .or(`user_id.is.null,user_id.eq.${userId}`)
          .eq('name', updateData.name)
          .maybeSingle();
        
        if (nameError) throw new Error(nameError.message);
        
        if (nameCheck) {
          throw new Error('Category with this name already exists');
        }
      }
      
      // Prepare update data
      const updates = {};
      if (updateData.name) updates.name = updateData.name;
      if (updateData.type) updates.type = updateData.type;
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.icon) updates.icon = updateData.icon;
      if (updateData.color) updates.color = updateData.color;
      
      // Update category
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      return {
        ...data,
        isSystem: false
      };
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  /**
   * Delete a custom category and optionally reassign transactions
   * @param {string} userId - User ID
   * @param {string} categoryId - Category ID
   * @param {string} replacementCategory - Category to reassign transactions to
   * @returns {Promise<boolean>} - True if successful
   */
  static async delete(userId, categoryId, replacementCategory) {
    try {
      // Check if category exists and belongs to user
      const { data: existing, error: checkError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw new Error(checkError.message);
      
      if (!existing) {
        throw new Error('Category not found or cannot be deleted');
      }
      
      // If replacement category provided, reassign transactions
      if (replacementCategory) {
        // Check if replacement category exists
        const { data: replacement, error: replaceCheckError } = await supabase
          .from('categories')
          .select('*')
          .or(`user_id.is.null,user_id.eq.${userId}`)
          .eq('name', replacementCategory)
          .maybeSingle();
        
        if (replaceCheckError) throw new Error(replaceCheckError.message);
        
        if (!replacement) {
          throw new Error('Replacement category not found');
        }
        
        // Update transactions
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ category: replacementCategory })
          .eq('user_id', userId)
          .eq('category', existing.name);
        
        if (updateError) throw new Error(updateError.message);
      }
      
      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);
      
      return true;
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  /**
   * Get system categories
   * @returns {Promise<Array>} - System categories
   */
  static async getSystemCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('user_id', null)
        .order('name');
      
      if (error) throw new Error(error.message);
      
      return data.map(category => ({
        ...category,
        isSystem: true
      }));
    } catch (error) {
      console.error('Get system categories error:', error);
      throw error;
    }
  }
}

module.exports = Category;