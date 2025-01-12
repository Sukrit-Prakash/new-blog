// backend/middleware/authenticate.js
const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  // Extract token from headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ msg: 'No token provided, authorization denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId, iat: timestamp, exp: timestamp }
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    res.status(401).json({ msg: 'Invalid token, authorization denied.' });
  }
};
