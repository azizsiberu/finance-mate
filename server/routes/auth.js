const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegister, validateLogin, validatePasswordReset } = require('../middlewares/validation');

// Register new user
router.post('/register', validateRegister, AuthController.register);

// Login user
router.post('/login', validateLogin, AuthController.login);

// Request password reset
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password
router.post('/reset-password', validatePasswordReset, AuthController.resetPassword);

// Verify token
router.post('/verify-token', AuthController.verifyToken);

module.exports = router;