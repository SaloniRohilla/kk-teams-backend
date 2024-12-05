const express = require('express');
const User = require('../models/user');
const { verify, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  console.log('Employees route accessed');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  next();
});

// Authentication middleware
router.use(verify);
router.use((req, res, next) => {
  console.log('Verification middleware passed');
  console.log('User:', req.user);
  next();
});

// Admin authorization middleware
router.use(isAdmin);
router.use((req, res, next) => {
  console.log('Admin middleware passed');
  next();
});

// Get all employees
router.get('/', async (req, res) => {
  console.log('GET / route handler called');
  try {
    const employees = await User.find({ role: 'user' });
    console.log('Employees found:', employees);
    res.json(employees);
  } catch (err) {
    console.error('Error in GET /:', err);
    res.status(500).json({ 
      error: 'Failed to fetch employees', 
      details: err.message 
    });
  }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
  console.log('GET /:id route handler called');
  try {
    const employee = await User.findById(req.params.id);
    if (!employee || employee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error in GET /:id:', err);
    res.status(500).json({ error: 'Failed to fetch employee', details: err.message });
  }
});

// Create a new employee
router.post('/', async (req, res) => {
  console.log('POST / route handler called');
  console.log('Request Body:', req.body);
  console.log('Current User:', req.user);

  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields', 
      details: {
        name: !!name,
        email: !!email,
        password: !!password
      }
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: 'user', // Default role for employees
    });

    await newUser.save();
    console.log('Employee created:', newUser);
    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Error in POST /:', err);
    res.status(500).json({ 
      error: 'Failed to create employee', 
      details: err.message,
      fullError: err
    });
  }
});

// Update employee details
router.put('/:id', async (req, res) => {
  console.log('PUT /:id route handler called');
  try {
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee || updatedEmployee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    console.log('Employee updated:', updatedEmployee);
    res.json(updatedEmployee);
  } catch (err) {
    console.error('Error in PUT /:id:', err);
    res.status(500).json({ error: 'Failed to update employee', details: err.message });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  console.log('DELETE /:id route handler called');
  try {
    const deletedEmployee = await User.findByIdAndDelete(req.params.id);
    if (!deletedEmployee || deletedEmployee.role !== 'user') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    console.log('Employee deleted:', deletedEmployee);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /:id:', err);
    res.status(500).json({ error: 'Failed to delete employee', details: err.message });
  }
});

module.exports = router;
