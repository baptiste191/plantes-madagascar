// backend/src/controllers/photoController.js
const Photo = require('../models/Photo');
const logger = require('../utils/logger');

exports.getByPlante = async (req, res) => {
  try {
    const fotos = await Photo.getByPlante(req.query.plante_id);
    res.json(fotos);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'Fichier manquant' });
    const result = await Photo.create({
      filename: req.file.filename,
      plante_id: req.body.plante_id
    });
    res.status(201).json(result);
  } catch (e) {
    logger.error(e);
    res.status(400).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Photo.delete(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ message: 'Photo non trouvée' });
    res.json(result);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};
