const express = require('express');
const Department = require('../models/Department'); // Assume you have a Department model
const User = require('../models/user'); // Assuming you have a User model
const router = express.Router();

// GET: Fetch all departments
router.get('/', async (req, res) => {
    try {
        // Fetch all departments with basic information
        const departments = await Department.find({}).select('name description');
        
        res.json(departments);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ 
            error: 'Failed to fetch departments', 
            details: err.message 
        });
    }
});

// GET: Fetch a single department by ID with its members
router.get('/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;
        
        // Find the department and populate its members
        const department = await Department.findById(departmentId)
            .populate({
                path: 'members',
                select: 'name email position' // Select specific user fields
            });
        
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        res.json(department);
    } catch (err) {
        console.error('Error fetching department details:', err);
        res.status(500).json({ 
            error: 'Failed to fetch department details', 
            details: err.message 
        });
    }
});

// POST: Create a new department
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate input
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        
        // Check if department already exists
        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({ error: 'Department with this name already exists' });
        }
        
        // Create new department
        const newDepartment = new Department({
            name,
            description,
            members: [] // Start with no members
        });
        
        await newDepartment.save();
        
        res.status(201).json(newDepartment);
    } catch (err) {
        console.error('Error creating department:', err);
        res.status(500).json({ 
            error: 'Failed to create department', 
            details: err.message 
        });
    }
});

// PUT: Add a member to a department
router.put('/:departmentId/add-member', async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { userId } = req.body;
        
        // Validate input
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Find the department
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if user is already in the department
        if (department.members.includes(userId)) {
            return res.status(400).json({ error: 'User is already in this department' });
        }
        
        // Add user to department
        department.members.push(userId);
        await department.save();
        
        // Update user's department
        user.department = departmentId;
        await user.save();
        
        res.json(department);
    } catch (err) {
        console.error('Error adding member to department:', err);
        res.status(500).json({ 
            error: 'Failed to add member to department', 
            details: err.message 
        });
    }
});

// DELETE: Remove a member from a department
router.delete('/:departmentId/remove-member/:userId', async (req, res) => {
    try {
        const { departmentId, userId } = req.params;
        
        // Find the department
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        // Remove user from department members
        department.members = department.members.filter(
            memberId => memberId.toString() !== userId
        );
        await department.save();
        
        // Update user's department
        const user = await User.findById(userId);
        if (user) {
            user.department = null;
            await user.save();
        }
        
        res.json(department);
    } catch (err) {
        console.error('Error removing member from department:', err);
        res.status(500).json({ 
            error: 'Failed to remove member from department', 
            details: err.message 
        });
    }
});

// PUT: Update department details
router.put('/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { name, description } = req.body;
        
        // Update department
        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            { name, description },
            { new: true, runValidators: true }
        );
        
        if (!updatedDepartment) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        res.json(updatedDepartment);
    } catch (err) {
        console.error('Error updating department:', err);
        res.status(500).json({ 
            error: 'Failed to update department', 
            details: err.message 
        });
    }
});

// DELETE: Delete a department
router.delete('/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;
        
        // Find and delete the department
        const deletedDepartment = await Department.findByIdAndDelete(departmentId);
        
        if (!deletedDepartment) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        // Remove department reference from users
        await User.updateMany(
            { department: departmentId },
            { $unset: { department: 1 } }
        );
        
        res.json({ 
            message: 'Department deleted successfully', 
            department: deletedDepartment 
        });
    } catch (err) {
        console.error('Error deleting department:', err);
        res.status(500).json({ 
            error: 'Failed to delete department', 
            details: err.message 
        });
    }
});

module.exports = router;