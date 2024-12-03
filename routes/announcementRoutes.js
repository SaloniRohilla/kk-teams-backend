const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();  // Use router instance, not app

// GET all announcements
router.get('/', async (req, res) => {
    try {
      const announcements = await Announcement.find();  // Fetch all announcements from the database
      res.json(announcements);  // Send the fetched data as a response
    } catch (err) {
      console.error('Error fetching announcements:', err);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

// POST a new announcement
router.post('/', async (req, res) => {  // Use router.post(), not app.post()
  const { title, content } = req.body;

  try {
    const newAnnouncement = new Announcement({ title, content });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

module.exports = router;  // Export the router
