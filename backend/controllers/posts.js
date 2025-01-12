// backend/controllers/posts.js
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, slug, content, categories, tags, coverImage, published } = req.body;
//   title: { type: String, required: true },
//   slug: { type: String, required: true, unique: true }, // URL-friendly identifier
//   content: { type: String, required: true }, // Markdown or plain HTML
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   categories: [{ type: String }], // E.g., "Tech", "Lifestyle"
//   tags: [{ type: String }], // Keywords for SEO
//   coverImage: { type: String }, 
//   views: { type: Number, default: 0 },
//   likes: { type: Number, default: 0 },
//   commentsCount: { type: Number, default: 0 },
//   published: { type: Boolean, default: false },
//   publishedAt: { type: Date },
//   updatedAt: { type: Date, default: Date.now }
//   const { title, slug, content, categories, tags, coverImage, published } = req.body;

  try {
  
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ msg: 'Slug already exists. Please choose another one.' });
    }

    // Create new post
    const newPost = new Post({
      title,
      slug,
      content,
      author: req.user.id, // Assumes `authenticateJWT` middleware sets `req.user`
      categories,
      tags,
      coverImage,
      published,
      publishedAt: published ? Date.now() : null
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Server error while creating post.' });
  }
};


exports.getPost = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOne({ slug }).populate('author', 'username email');
    if (!post || !post.published) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // Increment view count as a user has visited it
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ error: 'Server error while fetching post.' });
  }
};

/**
 * Get all published posts with pagination and optional search
 */
exports.getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of posts per page
  const skip = (page - 1) * limit;
  const searchQuery = req.query.q || ''; // Optional search query

  const category = req.query.category || ''; // Optional category filter

  try {
    let query = { published: true };

    if (searchQuery) {
      query = {
        ...query,
        $text: { $search: searchQuery }
      };
    }
    if (category && category !== 'All') {
      query.categories = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);
    //here are the pages
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({ posts, totalPages, currentPage: page });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Server error while fetching posts.' });
  }
};

/**
 * Update a post by ID
 */
exports.updatePost = async (req, res) => {
  const { id } = req.params;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, slug, content, categories, tags, coverImage, published } = req.body;

  try {
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // Check if the user is the author or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized to update this post.' });
    }
    // why this is here?
    // If slug is being updated, ensure uniqueness
    if (slug && slug !== post.slug) {
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        return res.status(400).json({ msg: 'Slug already exists. Please choose another one.' });
      }
    }

    // Update fields
    post.title = title || post.title;
    post.slug = slug || post.slug;
    post.content = content || post.content;
    post.categories = categories || post.categories;
    post.tags = tags || post.tags;
    post.coverImage = coverImage || post.coverImage;
    post.published = published !== undefined ? published : post.published;
    post.publishedAt = published ? (post.publishedAt || Date.now()) : null;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error.message);
    res.status(500).json({ error: 'Server error while updating post.' });
  }
};

/**
 * Delete a post by ID
 */
exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // Check if the user is the author or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized to delete this post.' });
    }

    // await post.remove();
    await Post.deleteOne({ _id: id });
    res.json({ msg: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ error: 'Server error while deleting post.' });
  }
};
