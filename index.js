const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const departmentRoutes = require('./routes/deptRoutes');
const connectToDatabase = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Comprehensive request logging middleware
app.use((req, res, next) => {
  console.log('-----------------------------------');
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.use(cors());
app.use(express.json()); // IMPORTANT: Ensure this is before route definitions
app.use(express.urlencoded({ extended: true }));

// Detailed route registration logging
console.log('Registering routes...');
app.use('/api/users', userRoutes);
console.log('User routes registered');

app.use('/api/employees', employeeRoutes);
console.log('Employee routes registered');

app.use('/api/announcements', announcementRoutes);
console.log('Announcement routes registered');

app.use('/api/leave-requests', leaveRoutes);
console.log('Leave routes registered');

app.use('/api/departments', departmentRoutes);

// Catch-all route to log any unhandled routes
app.use((req, res, next) => {
  console.log('Unhandled route:', req.method, req.path);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: err.message
  });
});

// Database connection
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });