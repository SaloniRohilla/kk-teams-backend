const jwt = require('jsonwebtoken');

// Authentication Middleware
const verify = (req, res, next) => {
  console.log('Verifying token...');
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;
    console.log('Token verified:', decoded);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(403).json({ message: 'Invalid token or token expired' });
  }
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  console.log('Checking admin role...');
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
  console.log('Admin check passed');
  next();
};

module.exports = { verify, isAdmin };
