const express = require('express');
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const User = require('../models/user');  // Import the User model
const router = express.Router();

// POST route to register a new user
router.post('/register', async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    // Create a new user with the hashed password
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });  // Handle errors
  }
});

// POST route to login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If successful, respond with a success message
    res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Retrieve all users from the database
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
