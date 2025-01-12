// backend/controllers/auth.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


exports.register = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { username, email, password } = req.body;

  try {
    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return error.status(400).json({ msg: 'User already exists with this email.' });
    }

    user = new User({
      username,
      email,
      passwordHash: await bcrypt.hash(password, 10)
    });

    const savedUser = await user.save();

    
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log(savedUser)
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
      
    });
    
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Server error while registering user.' });
  }
};


exports.login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Server error while logging in.' });
  }
};

//this compoent may not be needed
// this is needed as we want to check whether the user is logged in
exports.getUser = async (req, res) => {
  try {
    console.log('Fetching user with ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      console.warn('User not found with ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Server error while fetching user.' });
  }
};
