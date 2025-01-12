const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,// To track users who liked the comment
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested comments
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Comment', CommentSchema);
  