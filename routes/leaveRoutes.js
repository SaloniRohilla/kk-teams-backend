const express = require('express');
const LeaveRequest = require('../models/LeaveRequests');
const router = express.Router();

// GET all leave requests with optional status filter
router.get('/', async (req, res) => {
    try {
        const { status } = req.query; // Optional query parameter to filter by status
        const filter = status ? { status } : {}; // Apply filter if status is provided
        const leaveRequests = await LeaveRequest.find(filter);
        res.json(leaveRequests);
    } catch (err) {
        console.error('Error fetching leave requests:', err);
        res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
});

// POST a new leave request
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
            status: 'pending', // Default status
        });

        await newLeaveRequest.save();
        res.status(201).json(newLeaveRequest);
    } catch (err) {
        console.error('Error creating leave request:', err);
        res.status(500).json({ error: 'Failed to create leave request', details: err.message });
    }
});

// PATCH: Approve a leave request
router.patch('/:id/approve', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true, runValidators: true }
        );

        if (!updatedLeaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        res.json({ message: 'Leave request approved', leaveRequest: updatedLeaveRequest });
    } catch (err) {
        console.error('Error approving leave request:', err);
        res.status(500).json({ error: 'Failed to approve leave request', details: err.message });
    }
});

// PATCH: Reject a leave request
router.patch('/:id/reject', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true, runValidators: true }
        );

        if (!updatedLeaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        res.json({ message: 'Leave request rejected', leaveRequest: updatedLeaveRequest });
    } catch (err) {
        console.error('Error rejecting leave request:', err);
        res.status(500).json({ error: 'Failed to reject leave request', details: err.message });
    }
});

module.exports = router;
