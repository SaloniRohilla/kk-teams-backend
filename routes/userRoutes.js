const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model path
const verifyToken = require('../middlewares/authMiddleware'); // Middleware to verify token (if required in some routes)
const router = express.Router();

// POST route for user signup
router.post('/signup', async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;

  console.log("Request Body:", req.body);

  try {
    // Validate input fields
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,  // Store the hashed password
    });

    // Save the user to the database
    await user.save();

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// POST route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: '1h' } // Token expiration time (optional)
    );

    // Send the token and user data in the response
    res.status(200).json({
      message: 'Login successful',
      token, // JWT token
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// POST route for token verification
router.post('/verify', async (req, res) => {
  const token = req.body.token; // Get token from request body

  try {
    // Verify JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Find the user by ID extracted from the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // If everything is valid, return the user data and token status
    res.status(200).json({ message: 'Token is valid', user });

  } catch (err) {
    res.status(400).json({ message: 'Invalid token or server error' });
  }
});

// Optionally, if you want to protect specific routes, you can use verifyToken middleware here
// For example, for any route that requires a valid token (authentication), you can add:
// router.get('/protected-route', verifyToken, async (req, res) => {
//   res.status(200).json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
