const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const cloudinary = require('../config/cloudinary');

// Upload resume to Cloudinary as raw and save to DB
async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'tnt-resumes',
      resource_type: 'raw'
    });

    const resume = await Resume.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      resumeUrl: result.secure_url,
      resumePublicId: result.public_id
    });

    try { fs.unlinkSync(filePath); } catch (_) {}

    return res.status(201).json(resume);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// List resumes (basic)
async function listResumes(req, res) {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
}

module.exports = { uploadResume, listResumes };


