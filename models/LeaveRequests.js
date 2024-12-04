const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Valid statuses
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
