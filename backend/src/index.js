// backend/src/index.js
require('dotenv').config();             // charge .env
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// vos routes
const userRoutes   = require('./routes/userRoutes');
const planteRoutes = require('./routes/planteRoutes');
const photoRoutes  = require('./routes/photoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for photos
app.use('/photos', express.static(path.join(__dirname, '../db/photos')));
app.use('/api/photos', photoRoutes)

// Routes
app.use('/api/plantes',      require('./routes/planteRoutes'));
app.use('/api/photos',       require('./routes/photoRoutes'));
app.use('/api/utilisateurs', require('./routes/userRoutes'));
app.use('/api/stats',        require('./routes/statRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- gestion des 404 pour tout le reste ---
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} non trouvée` });
});

// --- démarrage ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
module.exports = app;
