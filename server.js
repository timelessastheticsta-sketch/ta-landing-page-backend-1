const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const leadsRouter = require('./src/routes/leads');
const resumesRouter = require('./src/routes/resumes');

const app = express();

app.use(cors());
app.use(express.json());


// --- Ping endpoint (yeh add karo) ---
app.get('/ping', (req, res) => {
  res.send('Server is awake ✅');
});

setInterval(() => {
  fetch("https://ta-landing-page-backend-1-1.onrender.com")
    .then(() => console.log("Pinged self to keep awake"))
    .catch((err) => console.error("Ping failed", err));
}, 5 * 60 * 1000); // every 5 minutes


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/leads', leadsRouter);
app.use('/api/resumes', resumesRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_URI || 'mongodb://localhost:27017/tnt-db';

// 🔑 Persistent DB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

async function start() {
  try {
    if (!MONGO_URI) {
      throw new Error('DB_URI is not set in backend/.env');
    }

    await connectDB(); // sirf ek hi baar connect hoga

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
