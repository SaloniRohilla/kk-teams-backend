const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model path
const verifyToken = require('../middlewares/authMiddleware'); // Middleware to verify token (if required in some routes)
const router = express.Router();

// POST route for user signup
router.post('/signup', async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;

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

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

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
    console.error("Error during signup:", err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    console.log("User fetched from DB:", user);  // Log the user data

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Log both plain-text password and the hashed password stored in DB
    console.log('Plain-text password:', password);
    console.log('Hashed password from DB:', user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);  // Logs true or false

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If passwords match, generate a token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});



// GET route to verify JWT token
router.get('/verifyToken', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Add log to see decoded JWT

    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId);
    console.log("User found by ID:", user); // Log the user found by ID
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Token is valid', user });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(400).json({ message: 'Invalid token or server error' });
  }
});

// Optionally, if you want to protect specific routes, you can use verifyToken middleware here
// For example, for any route that requires a valid token (authentication), you can add:
// router.get('/protected-route', verifyToken, async (req, res) => {
//   res.status(200).json({ message: 'This is a protected route', user: req.user });
// });

module.exports = router;
