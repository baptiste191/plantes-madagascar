// backend/src/controllers/statController.js
const Plante = require('../models/Plante');
const User   = require('../models/User');
const logger = require('../utils/logger');

exports.countPlantes = async (_, res) => {
  try {
    const all = await Plante.getAll({});
    res.json({ total: all.length });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.byRegion = async (_, res) => {
  try {
    const all = await Plante.getAll({});
    const dist = {};
    all.forEach(p => {
      (p.regions || '').split(',').map(r => r.trim()).forEach(r => {
        if (r) dist[r] = (dist[r] || 0) + 1;
      });
    });
    res.json(dist);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.byVertu = async (_, res) => {
  try {
    const all = await Plante.getAll({});
    const dist = {};
    all.forEach(p => {
      (p.vertus || '').split(',').map(v => v.trim()).forEach(v => {
        if (v) dist[v] = (dist[v] || 0) + 1;
      });
    });
    res.json(dist);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.connexions = async (_, res) => {
  try {
    const users = await User.getAll();
    res.json(users.map(u => ({
      nom: u.nom,
      derniere_connexion: u.derniere_connexion,
      nombre_connexion: u.nombre_connexion
    })));
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};
