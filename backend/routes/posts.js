// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { 
  createPost, 
  getPost, 
  getPosts, 
  updatePost, 
  deletePost 
} = require('../controllers/posts');

const { authenticateJWT } = require('../middleware/authenticate');

router.post(
  '/',
  [
    authenticateJWT,
    body('title').notEmpty().withMessage('Title is required.'),
    body('slug').notEmpty().withMessage('Slug is required.'),
    body('content').notEmpty().withMessage('Content is required.')
    
  ],
  createPost
);


router.get('/:slug', getPost);

router.get('/', getPosts);


router.put(
  '/:id',
  [
    authenticateJWT,
    body('title').optional().notEmpty().withMessage('Title cannot be empty.'),
    body('slug').optional().notEmpty().withMessage('Slug cannot be empty.'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty.')
   
  ],
  updatePost
);

router.delete('/:id', authenticateJWT, deletePost);

module.exports = router;
