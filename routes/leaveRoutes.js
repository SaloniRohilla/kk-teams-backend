const express = require('express');
const LeaveRequest = require('../models/LeaveRequests');
const router = express.Router(); // Ensure you're using the Router instance, not app directly

// POST: Create a new leave request
router.post('/', async (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;

  try {
    if (!userId || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newLeaveRequest = new LeaveRequest({
      userId,
      startDate,
      endDate,
      reason,
    });

    await newLeaveRequest.save(); // Save to DB
    res.status(201).json(newLeaveRequest); // Return the created leave request
  } catch (err) {
    console.error("Error creating leave request:", err);
    res.status(500).json({ error: 'Failed to create leave request', details: err.message });
  }
});

// Get all leave requests (GET /api/leave-requests)
router.get('/', async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find();  // Fetch all leave requests from the database
      res.json(leaveRequests);  // Send the data back as JSON
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
  });

module.exports = router; // Export the router, not app
