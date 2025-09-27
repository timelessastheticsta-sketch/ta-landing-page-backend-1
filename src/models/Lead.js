const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Email optional hai but agar diya gaya hai to unique hoga
    email: { type: String, trim: true, unique: true, sparse: true },

    // Phone required hai aur unique hoga
    phone: { type: String, required: true, trim: true, unique: true },

    message: { type: String, trim: true },

    source: { type: String, default: 'linkedin-landing' }
  },
  { timestamps: true }
);

// Make sure indexes are created in DB
LeadSchema.index({ email: 1 }, { unique: true, sparse: true });
LeadSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('Lead', LeadSchema);
