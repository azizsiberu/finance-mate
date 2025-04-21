const { isValidEmail, validatePasswordStrength } = require('../utils/helpers');

/**
 * Validate registration data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ 
      error: 'All fields are required (email, password, firstName, lastName)'
    });
  }
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ error: passwordValidation.message });
  }
  
  if (firstName.trim().length < 2 || lastName.trim().length < 2) {
    return res.status(400).json({ error: 'First name and last name must be at least 2 characters' });
  }
  
  next();
};

/**
 * Validate login data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};

/**
 * Validate password reset request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ error: passwordValidation.message });
  }
  
  next();
};

/**
 * Validate transaction data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateTransaction = (req, res, next) => {
  const { amount, type, category, date } = req.body;
  
  if (!amount || !type || !category || !date) {
    return res.status(400).json({ error: 'Amount, type, category, and date are required' });
  }
  
  if (isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'Amount must be a valid number' });
  }
  
  const validTypes = ['income', 'expense', 'transfer'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type must be income, expense, or transfer' });
  }
  
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
  }
  
  next();
};

/**
 * Validate subscription data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateSubscription = (req, res, next) => {
  const { 
    name,
    amount,
    category,
    startDate,
    billingCycle,
    nextBillingDate
  } = req.body;
  
  if (!name || !amount || !category || !startDate || !billingCycle || !nextBillingDate) {
    return res.status(400).json({ 
      error: 'Name, amount, category, start date, billing cycle, and next billing date are required'
    });
  }
  
  if (isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'Amount must be a valid number' });
  }
  
  const validCycles = ['weekly', 'monthly', 'quarterly', 'biannual', 'annual'];
  if (!validCycles.includes(billingCycle)) {
    return res.status(400).json({ 
      error: 'Billing cycle must be weekly, monthly, quarterly, biannual, or annual'
    });
  }
  
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(nextBillingDate)) {
    return res.status(400).json({ error: 'Dates must be in YYYY-MM-DD format' });
  }
  
  next();
};

/**
 * Validate budget data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateBudget = (req, res, next) => {
  const {
    name,
    amount,
    category,
    startDate,
    endDate,
    resetPeriod
  } = req.body;
  
  if (!name || !amount || !category || !startDate || !endDate || !resetPeriod) {
    return res.status(400).json({ 
      error: 'Name, amount, category, start date, end date, and reset period are required'
    });
  }
  
  if (isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'Amount must be a valid number' });
  }
  
  const validPeriods = ['monthly', 'quarterly', 'annual', 'custom'];
  if (!validPeriods.includes(resetPeriod)) {
    return res.status(400).json({ 
      error: 'Reset period must be monthly, quarterly, annual, or custom'
    });
  }
  
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({ error: 'Dates must be in YYYY-MM-DD format' });
  }
  
  // Ensure end date is after start date
  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }
  
  next();
};

/**
 * Validate financial goal data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateGoal = (req, res, next) => {
  const {
    name,
    targetAmount,
    targetDate,
    category
  } = req.body;
  
  if (!name || !targetAmount || !targetDate || !category) {
    return res.status(400).json({ 
      error: 'Name, target amount, target date, and category are required'
    });
  }
  
  if (isNaN(parseFloat(targetAmount))) {
    return res.status(400).json({ error: 'Target amount must be a valid number' });
  }
  
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(targetDate)) {
    return res.status(400).json({ error: 'Target date must be in YYYY-MM-DD format' });
  }
  
  // Ensure target date is in the future
  if (new Date(targetDate) <= new Date()) {
    return res.status(400).json({ error: 'Target date must be in the future' });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordReset,
  validateTransaction,
  validateSubscription,
  validateBudget,
  validateGoal
};