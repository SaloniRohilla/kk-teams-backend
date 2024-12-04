const express = require('express');
const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
const router = express.Router();

// GET all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ 
      error: 'Failed to fetch announcements', 
      details: err.message 
    });
  }
});

// GET a single announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: 'Invalid announcement ID format', 
        id: id 
      });
    }

    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({ 
        error: 'Announcement not found', 
        id: id 
      });
    }

    res.json(announcement);
  } catch (err) {
    console.error('Error fetching announcement:', err);
    res.status(500).json({ 
      error: 'Failed to fetch announcement', 
      details: err.message 
    });
  }
});

// POST a new announcement
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Title and content are required' 
      });
    }

    const newAnnouncement = new Announcement({ 
      title, 
      content 
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ 
      error: 'Failed to create announcement', 
      details: err.message 
    });
  }
});

// UPDATE an announcement
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: 'Invalid announcement ID format', 
        id: id 
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id, 
      { title, content }, 
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ 
        error: 'Announcement not found', 
        id: id 
      });
    }

    res.json(updatedAnnouncement);
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).json({ 
      error: 'Failed to update announcement', 
      details: err.message 
    });
  }
});


// Express.js route to handle DELETE request for announcement by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
});



module.exports = router;