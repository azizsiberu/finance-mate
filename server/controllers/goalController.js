const { uploadFile } = require('../utils/storage');
const Goal = require('../models/Goal');

/**
 * Create a new financial goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalData = req.body;

    const goal = await Goal.create(userId, goalData);
    
    res.status(201).json({
      message: 'Financial goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create financial goal' });
  }
};

/**
 * Get all financial goals for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const filters = req.query;
    
    const goals = await Goal.findAll(userId, filters);
    
    res.status(200).json({ goals });
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({ error: 'Failed to get financial goals' });
  }
};

/**
 * Get a specific financial goal by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getGoalById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    
    const goal = await Goal.findById(userId, goalId);
    
    if (!goal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }
    
    res.status(200).json({ goal });
  } catch (error) {
    console.error('Error getting goal:', error);
    res.status(500).json({ error: 'Failed to get financial goal' });
  }
};

/**
 * Update a financial goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    const updateData = req.body;
    
    const updatedGoal = await Goal.update(userId, goalId, updateData);
    
    if (!updatedGoal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }
    
    res.status(200).json({
      message: 'Financial goal updated successfully',
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update financial goal' });
  }
};

/**
 * Delete a financial goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    
    const success = await Goal.delete(userId, goalId);
    
    if (!success) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }
    
    res.status(200).json({ message: 'Financial goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete financial goal' });
  }
};

/**
 * Add contribution to a financial goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addContribution = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    const { amount, date, notes } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid contribution amount is required' });
    }
    
    const updatedGoal = await Goal.addContribution(userId, goalId, {
      amount: parseFloat(amount),
      date: date || new Date().toISOString(),
      notes
    });
    
    if (!updatedGoal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }
    
    res.status(200).json({
      message: 'Contribution added successfully',
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Error adding contribution:', error);
    res.status(500).json({ error: 'Failed to add contribution to goal' });
  }
};

/**
 * Upload file for a goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadGoalFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const goalId = req.params.goalId;
    const fileBuffer = req.file.buffer;
    const filePath = `goals/${goalId}-${Date.now()}.jpg`;
    const contentType = req.file.mimetype;

    // Upload file to Supabase Storage
    const publicUrl = await uploadFile(fileBuffer, filePath, contentType);

    // Update goal file URL in the database
    await Goal.update(goalId, { fileUrl: publicUrl });

    res.status(200).json({ message: 'Goal file uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading goal file:', error);
    res.status(500).json({ error: 'Failed to upload goal file' });
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  addContribution,
  uploadGoalFile,
};