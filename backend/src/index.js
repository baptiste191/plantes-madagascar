// backend/src/index.js
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for photos
app.use('/photos', express.static(path.join(__dirname, '../db/photos')));

// Routes
app.use('/api/plantes',      require('./routes/planteRoutes'));
app.use('/api/photos',       require('./routes/photoRoutes'));
app.use('/api/utilisateurs', require('./routes/userRoutes'));
app.use('/api/stats',        require('./routes/statRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
