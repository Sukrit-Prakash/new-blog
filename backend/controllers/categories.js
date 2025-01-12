const Category = require('../models/Category');
const { validationResult } = require('express-validator');

/**
 * Get all categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories: categories.map(cat => cat.name) });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Server error while fetching categories.' });
  }
};

/**
 * Create a new category
 */
exports.createCategory = async (req, res) => {
  // Only admin users should be able to create categories
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized to create categories.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists.' });
    }

    category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ error: 'Server error while creating category.' });
  }
};
