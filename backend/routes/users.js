// backend/routes/users.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/user');
const { authenticateJWT } = require('../middleware/authenticate');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', authenticateJWT, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', [
  body('username')
    .optional()
    .notEmpty().withMessage('Username cannot be empty.'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address.'),
  body('bio')
    .optional()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),
  body('socialLinks.twitter')
    .optional()
    .isURL().withMessage('Invalid Twitter URL.'),
  body('socialLinks.linkedin')
    .optional()
    .isURL().withMessage('Invalid LinkedIn URL.'),
  body('profilePicture')
    .optional()
    .isURL().withMessage('Invalid profile picture URL.')
], authenticateJWT, updateProfile);

module.exports = router;
