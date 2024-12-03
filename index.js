const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const employeeRoutes = require('./routes/employeeRoutes'); // Import employee routes
const announcementRoutes = require('./routes/announcementRoutes'); // Import announcement routes
const leaveRoutes = require('./routes/leaveRoutes'); // Import leave routes
const connectToDatabase = require('./db'); // Database connection
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // To parse incoming JSON requests

// Use the user routes for handling signup and login
app.use('/api/users', userRoutes);  // This ensures /api/users/signup and /api/users/login

// Use the employee routes for handling employee-related actions
app.use('/api/employees', employeeRoutes);  // This will route to employee-specific actions

// Use the announcement routes for handling announcement-related actions
app.use('/api/announcements', announcementRoutes);  // This will route to announcement-related actions

// Use the leave routes for handling leave-related actions
app.use('/api/leave-requests', leaveRoutes);  // This will route to leave request-related actions

// Connect to the database
connectToDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
