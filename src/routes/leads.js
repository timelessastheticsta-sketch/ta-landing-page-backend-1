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

// List leads with pagination, search, filter, sort
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status,
      assignedTo,
      sort = 'createdAt:desc'
    } = req.query;

    const numericLimit = Math.min(Number(limit) || 20, 100);
    const numericPage = Math.max(Number(page) || 1, 1);

    const query = {};
    if (search) {
      const pattern = new RegExp(search, 'i');
      query.$or = [{ name: pattern }, { email: pattern }, { phone: pattern }];
    }
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const [sortField, sortDir] = String(sort).split(':');
    const sortObj = { [sortField || 'createdAt']: sortDir === 'asc' ? 1 : -1 };

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortObj)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Lead.countDocuments(query)
    ]);

    res.json({ leads, total, page: numericPage, limit: numericLimit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Update lead (status, contacted, notes, follow-up, assignment)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Lead not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Add a single note
router.post('/:id/notes', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.notes.push({ text });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;



