const supabase = require('../config/supabase');

class Subscription {
  /**
   * Create a new subscription
   * @param {object} subscriptionData - Subscription data
   * @returns {Promise<object>} - Created subscription
   */
  static async create(subscriptionData) {
    try {
      const {
        userId,
        name,
        amount,
        billingCycle,
        category,
        startDate,
        endDate,
        reminderDays,
        autoPayment,
        notes,
        provider
      } = subscriptionData;

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          name,
          amount,
          billing_cycle: billingCycle,
          category,
          start_date: startDate,
          end_date: endDate || null,
          reminder_days: reminderDays || 3,
          auto_payment: autoPayment || false,
          notes: notes || null,
          provider: provider || null
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a user
   * @param {string} userId - User ID
   * @param {object} filters - Filter parameters
   * @returns {Promise<Array>} - Array of subscriptions
   */
  static async findAll(userId, filters = {}) {
    try {
      const {
        active,
        upcomingRenewal,
        category,
        sortBy = 'next_billing_date',
        sortOrder = 'asc'
      } = filters;

      // Start query
      let query = supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (active !== undefined) {
        if (active === true || active === 'true') {
          const today = new Date().toISOString().split('T')[0];
          query = query.or(`end_date.gt.${today},end_date.is.null`);
        } else {
          const today = new Date().toISOString().split('T')[0];
          query = query.lt('end_date', today);
        }
      }

      if (upcomingRenewal) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + parseInt(upcomingRenewal));
        
        query = query.lt('next_billing_date', futureDate.toISOString().split('T')[0])
                     .gte('next_billing_date', today.toISOString().split('T')[0]);
      }

      if (category) {
        query = query.eq('category', category);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data: subscriptions, error } = await query;
      
      if (error) throw new Error(error.message);

      // Calculate additional fields and return
      return subscriptions.map(sub => {
        // Calculate next billing date if not set
        if (!sub.next_billing_date) {
          sub.next_billing_date = this.calculateNextBillingDate(
            sub.start_date,
            sub.billing_cycle
          );
        }
        
        // Calculate annual cost
        sub.annual_cost = this.calculateAnnualCost(
          sub.amount,
          sub.billing_cycle
        );
        
        return sub;
      });
    } catch (error) {
      console.error('Error finding subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get subscription by ID
   * @param {string} id - Subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} - Subscription or null
   */
  static async findById(id, userId) {
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;

      // Calculate additional fields
      if (!subscription.next_billing_date) {
        subscription.next_billing_date = this.calculateNextBillingDate(
          subscription.start_date,
          subscription.billing_cycle
        );
      }
      
      // Calculate annual cost
      subscription.annual_cost = this.calculateAnnualCost(
        subscription.amount,
        subscription.billing_cycle
      );
      
      return subscription;
    } catch (error) {
      console.error('Error finding subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription
   * @param {string} id - Subscription ID
   * @param {string} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated subscription
   */
  static async update(id, userId, updateData) {
    try {
      // Check if subscription exists
      const existing = await this.findById(id, userId);
      if (!existing) {
        throw new Error('Subscription not found');
      }

      // Prepare update data with snake_case keys
      const updates = {};
      if (updateData.name !== undefined) updates.name = updateData.name;
      if (updateData.amount !== undefined) updates.amount = updateData.amount;
      if (updateData.billingCycle !== undefined) updates.billing_cycle = updateData.billingCycle;
      if (updateData.category !== undefined) updates.category = updateData.category;
      if (updateData.startDate !== undefined) updates.start_date = updateData.startDate;
      if (updateData.endDate !== undefined) updates.end_date = updateData.endDate;
      if (updateData.reminderDays !== undefined) updates.reminder_days = updateData.reminderDays;
      if (updateData.autoPayment !== undefined) updates.auto_payment = updateData.autoPayment;
      if (updateData.notes !== undefined) updates.notes = updateData.notes;
      if (updateData.provider !== undefined) updates.provider = updateData.provider;
      if (updateData.nextBillingDate !== undefined) updates.next_billing_date = updateData.nextBillingDate;
      if (updateData.lastBillingDate !== undefined) updates.last_billing_date = updateData.lastBillingDate;

      // Update subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // Calculate additional fields
      if (!subscription.next_billing_date) {
        subscription.next_billing_date = this.calculateNextBillingDate(
          subscription.start_date,
          subscription.billing_cycle
        );
      }
      
      // Calculate annual cost
      subscription.annual_cost = this.calculateAnnualCost(
        subscription.amount,
        subscription.billing_cycle
      );
      
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Delete subscription
   * @param {string} id - Subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id, userId) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  /**
   * Get upcoming renewals in the next X days
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Array>} - Array of subscriptions
   */
  static async getUpcomingRenewals(userId, days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .lt('next_billing_date', futureDate.toISOString().split('T')[0])
        .gte('next_billing_date', today.toISOString().split('T')[0])
        .order('next_billing_date', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return subscriptions.map(sub => {
        // Calculate annual cost
        sub.annual_cost = this.calculateAnnualCost(sub.amount, sub.billing_cycle);
        
        // Calculate days until renewal
        const nextBilling = new Date(sub.next_billing_date);
        const daysUntil = Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
        sub.days_until_renewal = daysUntil;
        
        return sub;
      });
    } catch (error) {
      console.error('Error getting upcoming renewals:', error);
      throw error;
    }
  }

  /**
   * Record subscription payment
   * @param {string} id - Subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Updated subscription
   */
  static async recordPayment(id, userId) {
    try {
      // Get subscription
      const subscription = await this.findById(id, userId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Calculate next billing date based on the current one
      const currentBillingDate = subscription.next_billing_date || new Date().toISOString().split('T')[0];
      const nextBillingDate = this.calculateNextBillingDate(
        currentBillingDate,
        subscription.billing_cycle
      );

      // Update subscription
      const { data: updatedSubscription, error } = await supabase
        .from('subscriptions')
        .update({
          last_billing_date: currentBillingDate,
          next_billing_date: nextBillingDate
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // Calculate annual cost
      updatedSubscription.annual_cost = this.calculateAnnualCost(
        updatedSubscription.amount,
        updatedSubscription.billing_cycle
      );
      
      return updatedSubscription;
    } catch (error) {
      console.error('Error recording subscription payment:', error);
      throw error;
    }
  }

  /**
   * Calculate annual cost based on amount and billing cycle
   * @param {number} amount - Subscription amount
   * @param {string} billingCycle - Billing cycle (monthly, quarterly, yearly, etc.)
   * @returns {number} - Annual cost
   */
  static calculateAnnualCost(amount, billingCycle) {
    switch (billingCycle.toLowerCase()) {
      case 'weekly':
        return amount * 52;
      case 'biweekly':
        return amount * 26;
      case 'monthly':
        return amount * 12;
      case 'bimonthly':
        return amount * 6;
      case 'quarterly':
        return amount * 4;
      case 'biannual':
      case 'semiannual':
        return amount * 2;
      case 'annual':
      case 'yearly':
        return amount;
      default:
        return amount * 12; // Default to monthly
    }
  }

  /**
   * Calculate next billing date based on start date and billing cycle
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} billingCycle - Billing cycle
   * @returns {string} - Next billing date (YYYY-MM-DD)
   */
  static calculateNextBillingDate(startDate, billingCycle) {
    const today = new Date();
    let date = new Date(startDate);
    
    // If date is in the past, we need to find the next billing date
    if (date < today) {
      switch (billingCycle.toLowerCase()) {
        case 'weekly':
          while (date < today) {
            date.setDate(date.getDate() + 7);
          }
          break;
        case 'biweekly':
          while (date < today) {
            date.setDate(date.getDate() + 14);
          }
          break;
        case 'monthly':
          while (date < today) {
            date.setMonth(date.getMonth() + 1);
          }
          break;
        case 'bimonthly':
          while (date < today) {
            date.setMonth(date.getMonth() + 2);
          }
          break;
        case 'quarterly':
          while (date < today) {
            date.setMonth(date.getMonth() + 3);
          }
          break;
        case 'biannual':
        case 'semiannual':
          while (date < today) {
            date.setMonth(date.getMonth() + 6);
          }
          break;
        case 'annual':
        case 'yearly':
          while (date < today) {
            date.setFullYear(date.getFullYear() + 1);
          }
          break;
        default:
          while (date < today) {
            date.setMonth(date.getMonth() + 1);
          }
      }
    }
    
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Get subscription stats and summaries
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Subscription statistics
   */
  static async getSubscriptionStats(userId) {
    try {
      // Get all active subscriptions
      const subscriptions = await this.findAll(userId, { active: true });
      
      // Calculate totals
      const totalMonthly = subscriptions.reduce((sum, sub) => {
        // Convert to monthly cost based on billing cycle
        const monthlyCost = this.calculateAnnualCost(sub.amount, sub.billing_cycle) / 12;
        return sum + monthlyCost;
      }, 0);
      
      const totalAnnual = subscriptions.reduce((sum, sub) => {
        return sum + this.calculateAnnualCost(sub.amount, sub.billing_cycle);
      }, 0);
      
      // Group by category
      const categoryBreakdown = {};
      subscriptions.forEach(sub => {
        const category = sub.category || 'Uncategorized';
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = {
            count: 0,
            monthlyCost: 0,
            annualCost: 0
          };
        }
        
        categoryBreakdown[category].count++;
        categoryBreakdown[category].monthlyCost += this.calculateAnnualCost(sub.amount, sub.billing_cycle) / 12;
        categoryBreakdown[category].annualCost += this.calculateAnnualCost(sub.amount, sub.billing_cycle);
      });
      
      // Most expensive subscriptions
      const mostExpensive = [...subscriptions]
        .sort((a, b) => this.calculateAnnualCost(b.amount, b.billing_cycle) - 
                         this.calculateAnnualCost(a.amount, a.billing_cycle))
        .slice(0, 5);
      
      return {
        totalCount: subscriptions.length,
        totalMonthly: parseFloat(totalMonthly.toFixed(2)),
        totalAnnual: parseFloat(totalAnnual.toFixed(2)),
        categoryBreakdown,
        mostExpensive,
        upcomingRenewals: await this.getUpcomingRenewals(userId)
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      throw error;
    }
  }
}

module.exports = Subscription;