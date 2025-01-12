// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },// ye kyu rakha yaha pe
  profilePicture: { type: String },
  role: { type: String, enum: ['reader', 'author', 'admin'], default: 'reader' },
  bio: { type: String, maxLength: 500 },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
