const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const connectToDatabase = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // To parse incoming JSON requests

// Use the user routes
app.use('/api/users', userRoutes);

// Connect to the database
connectToDatabase();

// POST route to create a new user
app.post('/api/users', async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const user = new User({ name, email, role, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
