const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');
const { validateCategory } = require('../middlewares/validation');

// Get all categories for a user
router.get('/', authenticate, CategoryController.getAllCategories);

// Create a new custom category
router.post('/', authenticate, validateCategory, CategoryController.createCategory);

// Update a custom category
router.put('/:id', authenticate, validateCategory, CategoryController.updateCategory);

// Delete a custom category
router.delete('/:id', authenticate, CategoryController.deleteCategory);

// Get system categories
router.get('/system', CategoryController.getSystemCategories);

module.exports = router;