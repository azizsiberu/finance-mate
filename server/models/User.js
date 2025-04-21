const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

class User {
  /**
   * Find a user by their email
   * @param {string} email - User email
   * @returns {Promise<object|null>} - User data or null if not found
   */
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find a user by their ID
   * @param {string} id - User ID
   * @returns {Promise<object|null>} - User data or null if not found
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {object} userData - User data (email, password, firstName, lastName)
   * @returns {Promise<object>} - Created user data
   */
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          password: hashedPassword,
          first_name: userData.firstName,
          last_name: userData.lastName
        }])
        .select('id, email, first_name, last_name')
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user by ID
   * @param {string} id - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated user data
   */
  static async update(id, updateData) {
    try {
      // Prepare update data
      const updates = {};
      
      if (updateData.firstName) updates.first_name = updateData.firstName;
      if (updateData.lastName) updates.last_name = updateData.lastName;
      if (updateData.partnerId) updates.partner_id = updateData.partnerId;
      if (updateData.partnerEmail) updates.partner_email = updateData.partnerEmail;
      if (updateData.resetToken) updates.reset_token = updateData.resetToken;
      if (updateData.resetTokenExpires) updates.reset_token_expires = updateData.resetTokenExpires;
      
      // If password is provided, hash it
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updateData.password, salt);
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('id, email, first_name, last_name, partner_id, partner_email')
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - True if successful
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Compare a password with a user's hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} - True if passwords match
   */
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Find a user by reset token
   * @param {string} token - Reset token
   * @returns {Promise<object|null>} - User data or null
   */
  static async findByResetToken(token) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('reset_token', token)
        .single();
      
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      throw error;
    }
  }
}

module.exports = User;