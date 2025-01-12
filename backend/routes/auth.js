const express = require('express');

const router = express.Router();

const{body} = require('express-validator')
// const {register,login,getUser} = router('../controllers/auth')
const { register, login, getUser } = require('../controllers/auth');
const {authenticateJWT} = require('../middleware/authenticate')

router.post('/login',[body('email').isEmail().withMessage('Invalid email.'),
body('password').notEmpty().withMessage('Password is required.')
],login)

router.post('/register',[body('username').notEmpty().withMessage('Username is required.'),
body('email').isEmail().withMessage('Invalid email.'),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
],register)
// router.get('/user',getUser)
router.get('/user',authenticateJWT,getUser)

module.exports = router