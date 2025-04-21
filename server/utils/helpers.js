/**
 * Common utility functions for the FinanceMate application
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with status and message
 */
const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }

  return { isValid: true, message: 'Password is valid' };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {object} details - Error details
 * @returns {object} - Formatted error object
 */
const formatError = (message, details = null) => {
  return {
    error: {
      message,
      details: details || {},
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Format success response
 * @param {string} message - Success message
 * @param {object} data - Response data
 * @returns {object} - Formatted success object
 */
const formatSuccess = (message, data = null) => {
  return {
    success: true,
    message,
    data: data || {},
    timestamp: new Date().toISOString()
  };
};

/**
 * Calculate next billing date based on billing cycle
 * @param {Date} currentDate - Current billing date
 * @param {string} billingCycle - Billing cycle (weekly, monthly, quarterly, etc.)
 * @returns {Date} - Next billing date
 */
const calculateNextBillingDate = (currentDate, billingCycle) => {
  const nextDate = new Date(currentDate);
  
  switch (billingCycle) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'biannual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1); // Default to monthly
  }
  
  return nextDate;
};

/**
 * Generate a random password
 * @param {number} length - Password length
 * @returns {string} - Random password
 */
const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  
  // Ensure at least one uppercase, one lowercase, one digit
  password += chars.charAt(Math.floor(Math.random() * 26));  // Uppercase
  password += chars.charAt(26 + Math.floor(Math.random() * 26));  // Lowercase
  password += chars.charAt(52 + Math.floor(Math.random() * 10));  // Digit
  password += chars.charAt(62 + Math.floor(Math.random() * 10));  // Special char
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the password
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  return password;
};

module.exports = {
  isValidEmail,
  validatePasswordStrength,
  formatError,
  formatSuccess,
  calculateNextBillingDate,
  generateRandomPassword
};