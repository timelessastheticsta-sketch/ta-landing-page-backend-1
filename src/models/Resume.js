const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    position: { type: String, trim: true },
    resumeUrl: { type: String, required: true },
    resumePublicId: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);


