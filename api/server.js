// api/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('@vercel/node'); // needed only for clarity; actual handler below

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB model (optional - you can import your model)
const Reading = mongoose.model('Reading', new mongoose.Schema({
  temperature: Number,
  humidity: Number,
}, { timestamps: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

// Routes
app.post('/api/data', async (req, res) => {
  await connectToDB();
  const { temperature, humidity } = req.body;

  if (typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).send('Invalid data');
  }

  const reading = new Reading({ temperature, humidity });
  await reading.save();

  res.status(201).send('Data saved');
});

app.get('/api/data', async (req, res) => {
  await connectToDB();
  const data = await Reading.find().sort({ createdAt: -1 }).limit(10);
  res.json(data);
});

// Export Express app wrapped as Vercel function
module.exports = app;
