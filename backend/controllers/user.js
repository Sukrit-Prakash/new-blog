// backend/controllers/user.js

const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * GET /api/users/profile
 * Retrieves the authenticated user's profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes authenticateJWT middleware sets req.user
    const user = await User.findById(userId).select('-passwordHash'); // Exclude passwordHash
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

/**
 * PUT /api/users/profile
 * Updates the authenticated user's profile.
 */
exports.updateProfile = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, bio, socialLinks, profilePicture } = req.body;

  try {
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (socialLinks) user.socialLinks = socialLinks;
    if (profilePicture) user.profilePicture = profilePicture; // Handle image upload separately if needed

    user.updatedAt = Date.now();

    await user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        socialLinks: user.socialLinks,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};
