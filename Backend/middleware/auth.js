// backend/middleware/auth.js
// ===========================================
// JWT Authentication Middleware
// ===========================================
// This middleware protects routes that require a logged-in user.
// It checks for a valid JWT token in the Authorization header.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.replace('Bearer ', '');

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user from the decoded token payload
    // Select everything EXCEPT the password hash
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is valid but user no longer exists.' });
    }

    // 5. Attach user to the request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = auth;
