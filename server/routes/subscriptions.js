const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const SubscriptionController = require('../controllers/subscriptionController');

// Protect all routes
router.use(auth);

// GET /api/subscriptions - Get all subscriptions
router.get('/', SubscriptionController.getAllSubscriptions);

// GET /api/subscriptions/stats - Get subscription statistics
router.get('/stats', SubscriptionController.getSubscriptionStats);

// GET /api/subscriptions/upcoming - Get upcoming renewals
router.get('/upcoming', SubscriptionController.getUpcomingRenewals);

// GET /api/subscriptions/:id - Get single subscription
router.get('/:id', SubscriptionController.getSubscription);

// POST /api/subscriptions - Create subscription
router.post('/', SubscriptionController.createSubscription);

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', SubscriptionController.updateSubscription);

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', SubscriptionController.deleteSubscription);

// POST /api/subscriptions/:id/payment - Record a payment
router.post('/:id/payment', SubscriptionController.recordPayment);

module.exports = router;