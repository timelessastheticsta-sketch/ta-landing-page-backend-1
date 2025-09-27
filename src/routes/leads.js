const express = require('express');
const Lead = require('../models/Lead');

const router = express.Router();

// Create lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const lead = await Lead.create({ name, email, phone, message, source });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// List leads (basic admin)
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

module.exports = router;



