const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCategories, createCategory } = require('../controllers/categories');
const { authenticateJWT } = require('../middleware/authenticate');

// Get all categories
router.get('/', getCategories);

// Create a new category (Admin only)
router.post(
  '/',
  [
    authenticateJWT,
    body('name').notEmpty().withMessage('Category name is required.'),
  ],
  createCategory
);

module.exports = router;
