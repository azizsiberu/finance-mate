const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      
      // Create new user
      const newUser = await User.create({
        email,
        password,
        firstName,
        lastName
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Verify password
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          partnerId: user.partner_id,
          partnerEmail: user.partner_email
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Request password reset
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      // Find user by email
      const user = await User.findByEmail(email);
      
      // If user doesn't exist, still return success response for security
      if (!user) {
        return res.status(200).json({ 
          message: 'If the email exists, a reset link will be sent'
        });
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour
      
      // Save reset token to user
      await User.update(user.id, {
        resetToken,
        resetTokenExpires: resetTokenExpiry.toISOString()
      });
      
      // Send email with reset link
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'FinanceMate - Password Reset',
        html: `
          <h1>Password Reset</h1>
          <p>You have requested a password reset for your FinanceMate account.</p>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email or contact support.</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process password reset request' });
    }
  }

  /**
   * Reset password with token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      // Find user with this reset token
      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
      
      // Check if token is expired
      const now = new Date();
      const tokenExpiry = new Date(user.reset_token_expires);
      
      if (now > tokenExpiry) {
        return res.status(400).json({ error: 'Reset token expired' });
      }
      
      // Update user with new password and clear reset token
      await User.update(user.id, {
        password: newPassword,
        resetToken: null,
        resetTokenExpires: null
      });
      
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  /**
   * Verify JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      // Verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user data
        const user = await User.findById(decoded.userId);
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid token' });
        }
        
        res.status(200).json({
          message: 'Token is valid',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            partnerId: user.partner_id,
            partnerEmail: user.partner_email
          }
        });
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({ error: 'Failed to verify token' });
    }
  }
}

module.exports = AuthController;