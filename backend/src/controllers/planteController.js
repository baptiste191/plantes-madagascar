// backend/src/controllers/planteController.js
const Plante = require('../models/Plante');
const logger = require('../utils/logger');

exports.getAll = async (req, res) => {
  try {
    const filtres = {
      nom: req.query.nom,
      vertu: req.query.vertu,
      region: req.query.region
    };
    const data = await Plante.getAll(filtres);
    res.json(data);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const p = await Plante.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Plante non trouvée' });
    res.json(p);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await Plante.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    logger.error(e);
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await Plante.update(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ message: 'Aucune modification' });
    res.json(result);
  } catch (e) {
    logger.error(e);
    res.status(400).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Plante.delete(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ message: 'Plante non trouvée' });
    res.json(result);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};
