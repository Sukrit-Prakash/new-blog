const express = require('express');
const router = express.Router();

const{body}= require('express-validator')

const {createComment,getComments,deleteComment} = require('../controllers/comment')

const {authenticateJWT} = require('../middleware/authenticate')

router.post('/',[authenticateJWT,
    body('content').notEmpty().withMessage('Content is required.'),
    body('postId').notEmpty().withMessage('Post ID is required.'),
    body('parentId').optional().isMongoId().withMessage('Invalid parent ID.')
],createComment);

router.get('/:postId',getComments);

router.delete('/:id',authenticateJWT,deleteComment);

module.exports = router