const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL-friendly identifier
    content: { type: String, required: true }, // Markdown or plain HTML
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: String }], // E.g., "Tech", "Lifestyle"
    tags: [{ type: String }], // Keywords for SEO
    coverImage: { type: String }, 
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now }
  });
  
  PostSchema.index({title:'text',content:'text',tags:'text'});

  module.exports = mongoose.model('Post', PostSchema);
  