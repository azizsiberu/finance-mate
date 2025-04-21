const Subscription = require('../models/Subscription');
const { validateRequest } = require('../utils/helpers');

/**
 * Subscription Controller
 */
class SubscriptionController {
  /**
   * Get all subscriptions for a user
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async getAllSubscriptions(req, res) {
    try {
      const userId = req.user.id;
      const { active, upcomingRenewal, category, sortBy, sortOrder } = req.query;
      
      const subscriptions = await Subscription.findAll(userId, {
        active,
        upcomingRenewal,
        category,
        sortBy,
        sortOrder
      });
      
      res.status(200).json({
        success: true,
        count: subscriptions.length,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error in getAllSubscriptions:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Get a single subscription
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async getSubscription(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const subscription = await Subscription.findById(id, userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Error in getSubscription:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Create a new subscription
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async createSubscription(req, res) {
    try {
      const userId = req.user.id;
      
      // Validate required fields
      const requiredFields = ['name', 'amount', 'billingCycle', 'startDate'];
      const validationResult = validateRequest(req.body, requiredFields);
      
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${validationResult.missingFields.join(', ')}`
        });
      }
      
      // Create subscription with user ID
      const subscriptionData = {
        ...req.body,
        userId
      };
      
      const subscription = await Subscription.create(subscriptionData);
      
      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Error in createSubscription:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Update a subscription
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async updateSubscription(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if subscription exists
      const existingSubscription = await Subscription.findById(id, userId);
      
      if (!existingSubscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      // Update subscription
      const updatedSubscription = await Subscription.update(id, userId, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedSubscription
      });
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Delete a subscription
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async deleteSubscription(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if subscription exists
      const existingSubscription = await Subscription.findById(id, userId);
      
      if (!existingSubscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      // Delete subscription
      await Subscription.delete(id, userId);
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error('Error in deleteSubscription:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Get upcoming subscription renewals
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async getUpcomingRenewals(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 7;
      
      const renewals = await Subscription.getUpcomingRenewals(userId, days);
      
      res.status(200).json({
        success: true,
        count: renewals.length,
        data: renewals
      });
    } catch (error) {
      console.error('Error in getUpcomingRenewals:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Record payment for a subscription
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async recordPayment(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if subscription exists
      const existingSubscription = await Subscription.findById(id, userId);
      
      if (!existingSubscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      // Record payment
      const updatedSubscription = await Subscription.recordPayment(id, userId);
      
      res.status(200).json({
        success: true,
        data: updatedSubscription
      });
    } catch (error) {
      console.error('Error in recordPayment:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }

  /**
   * Get subscription statistics
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  static async getSubscriptionStats(req, res) {
    try {
      const userId = req.user.id;
      
      const stats = await Subscription.getSubscriptionStats(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getSubscriptionStats:', error);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
}

module.exports = SubscriptionController;