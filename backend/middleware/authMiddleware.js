const jwt = require('jsonwebtoken');
const store = require('../config/store');

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stockpulse_secret_key');

      // Get user from the token, exclude password
      req.user = await store.findUserById(decoded.id);

      if (!req.user) {
        req.user = { _id: decoded.id, name: 'Demo User', email: 'user@example.com' };
      }

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
