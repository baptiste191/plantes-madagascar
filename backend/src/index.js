// backend/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier statique pour les photos
app.use('/photos', express.static(path.join(__dirname, '../db/photos')));

// Routes
const planteRoutes = require('./routes/planteRoutes');
const photoRoutes = require('./routes/photoRoutes');
const userRoutes  = require('./routes/userRoutes');
const statRoutes  = require('./routes/statRoutes');

app.use('/api/plantes', planteRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/utilisateurs', userRoutes);
app.use('/api/stats', statRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
