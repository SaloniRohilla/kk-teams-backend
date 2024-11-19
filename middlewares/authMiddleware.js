const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token required' });
  }

  try {
    // Verify the token and add the decoded user info to the request object
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded; // Save decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token or token expired' });
  }
};

module.exports = verify;
