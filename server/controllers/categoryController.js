const Category = require('../models/Category');

class CategoryController {
  /**
   * Get all categories with usage statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllCategories(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        type: req.query.type,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        sortBy: req.query.sortBy || 'name',
        sortOrder: req.query.sortOrder || 'asc'
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const categories = await Category.getAllWithStats(userId, filters);
      
      res.status(200).json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to get categories' });
    }
  }

  /**
   * Create a new custom category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createCategory(req, res) {
    try {
      const userId = req.user.userId;
      const {
        name,
        type,
        description,
        icon,
        color
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const category = await Category.create(userId, {
        name,
        type,
        description,
        icon,
        color
      });

      res.status(201).json({
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      if (error.message === 'Category with this name already exists') {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }

  /**
   * Update a custom category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateCategory(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const {
        name,
        type,
        description,
        icon,
        color
      } = req.body;

      const category = await Category.update(userId, id, {
        name,
        type,
        description,
        icon,
        color
      });

      res.status(200).json({
        message: 'Category updated successfully',
        category
      });
    } catch (error) {
      if (error.message === 'Category not found or cannot be edited' ||
          error.message === 'Category with this name already exists') {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }

  /**
   * Delete a custom category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteCategory(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const { replacementCategory } = req.body;

      await Category.delete(userId, id, replacementCategory);

      res.status(200).json({
        message: 'Category deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Category not found or cannot be deleted') {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }

  /**
   * Get system categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSystemCategories(req, res) {
    try {
      const categories = await Category.getSystemCategories();
      
      res.status(200).json({ categories });
    } catch (error) {
      console.error('Get system categories error:', error);
      res.status(500).json({ error: 'Failed to get system categories' });
    }
  }
}

module.exports = CategoryController;