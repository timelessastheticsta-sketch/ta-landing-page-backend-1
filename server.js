const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: path.join(__dirname, '.env') });

const leadsRouter = require('./src/routes/leads');
const resumesRouter = require('./src/routes/resumes');

const app = express();

app.use(cors());
app.use(express.json());

// --- Ping endpoint ---
app.get('/ping', (req, res) => {
  res.send('Server is awake ✅');
});

// --- Self Ping every 5 minutes ---
setInterval(() => {
  fetch("https://ta-landing-page-backend-1-1.onrender.com")
    .then(() => console.log("Pinged self to keep awake"))
    .catch((err) => console.error("Ping failed", err));
}, 5 * 60 * 1000);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/leads', leadsRouter);
app.use('/api/resumes', resumesRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_URI || 'mongodb://localhost:27017/tnt-db';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

async function start() {
  try {
    if (!MONGO_URI) throw new Error('DB_URI is not set in backend/.env');
    await connectDB();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
