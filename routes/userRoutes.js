const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model path
const verify = require('../middlewares/authMiddleware'); // Middleware to verify token (if required in some routes)
const router = express.Router();

// POST route for user signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user 
    const newUser = new User({ name, email, password, role});
    await newUser.save();

    const { token } = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie('authToken', token, { httpOnly: true });
    res.status(201).json({ 
      message: 'User created successfully', 
      token, 
      user: { 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role
        
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token } = await User.matchPasswordAndGenerateToken(email, password);
    const user = await User.findOne({ email });
    res.cookie('authToken', token, { httpOnly: true });
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        _id: user._id 
      } 
    });
    console.log('User ID on successful login:', user._id);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ message: 'Invalid credentials', error: error.message });
  }
});



// GET route to verify JWT token
// router.get('/verify', async (req, res) => {
//   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Extract Bearer token

//   if (!token) {
//     return res.status(400).json({ message: 'Token not provided' });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.secret);  // Make sure the secret is correct

//     console.log('Decoded JWT:', decoded); // Log decoded token for debugging

//     // Fetch user based on decoded userId
//     const user = await User.findById(decoded.userId);
//     console.log('User found by ID:', user); // Log user found by ID

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Token is valid and user is found
//     return res.status(200).json({ message: 'Token is valid', user });
//   } catch (err) {
//     // Log the error for debugging purposes
//     console.error('Error verifying token:', err);

//     // Send detailed error message based on error type
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(400).json({ message: 'Invalid token' });
//     } else if (err.name === 'TokenExpiredError') {
//       return res.status(400).json({ message: 'Token has expired' });
//     }

//     // For other errors
//     return res.status(500).json({ message: 'Server error while verifying token' });
//   }
// });

// Optionally, if you want to protect specific routes, you can use verifyToken middleware here
// For example, for any route that requires a valid token (authentication), you can add:
// router.get('/protected-route', verifyToken, async (req, res) => {
//   res.status(200).json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
