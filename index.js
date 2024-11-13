const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import your user routes
const connectToDatabase = require('./db'); // Database connection
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // To parse incoming JSON requests

// Use the user routes for handling signup and login
app.use('/api/users', userRoutes);  // This ensures /api/users/signup and /api/users/login

// Connect to the database
connectToDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
