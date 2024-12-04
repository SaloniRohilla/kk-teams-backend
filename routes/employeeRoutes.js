const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get all employees (users with role: 'user')
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'user' });  // Fetch users with role 'user'
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get a single employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create a new employee (user with role 'user')
router.post('/employees', async (req, res) => {
  const { name, email, password } = req.body;  // Remove department from here
  try {
    const newUser = new User({
      name,
      email,
      password,
      role: 'user',  // Set role as 'user' for employees
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee data (e.g., department) - No department in update
router.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      req.body,  // No department anymore
      { new: true }
    );
    if (!updatedEmployee || updatedEmployee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await User.findByIdAndDelete(req.params.id);
    if (!deletedEmployee || deletedEmployee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
