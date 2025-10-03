const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const FollowUpSchema = new mongoose.Schema(
  {
    date: { type: Date },
    time: { type: String },
    message: { type: String, trim: true }
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    source: { type: String, default: 'linkedin-landing' },
    assignedTo: { type: String, trim: true },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Contacted', 'Won', 'Lost'],
      default: 'New'
    },
    contacted: { type: Boolean, default: false },
    notes: { type: [NoteSchema], default: [] },
    followUp: { type: FollowUpSchema }
  },
  { timestamps: true }
);

// Helpful indexes for queries
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ name: 'text', email: 'text', message: 'text' });

module.exports = mongoose.model('Lead', LeadSchema);
