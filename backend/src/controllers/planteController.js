// backend/src/controllers/planteController.js
const logger = require('../utils/logger');
const path   = require('path')
const db     = require('../config/db')
const Photo  = require('../models/Photo')
const Plante = require('../models/Plante')
const fs     = require('fs')

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

exports.deletePlante = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  console.log(`→ deletePlante invoked for plant id=${id}`)

  try {
    // 1) Récupère toutes les photos de cette plante
    const photos = await Photo.getByPlante(id)
    console.log('   photos trouvées =', photos)

    // 2) Supprime chaque fichier sur le disque
    const photosDir = path.resolve(__dirname, '../../db/photos')
    for (const { filename } of photos) {
      const filePath = path.join(photosDir, filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log('   fichier supprimé =', filePath)
      } else {
        console.log('   fichier introuvable =', filePath)
      }
    }

    // 3) Supprime tous les enregistrements photos en base
    const { changes: photosDeleted } = await Photo.deleteByPlante(id)
    console.log(`   ${photosDeleted} ligne(s) photos effacée(s) en base`)

    // 4) Supprime la plante
    const result = await Plante.delete(id)
    console.log(`   plante supprimée id=${id}`, result)

    // 5) Envoie la réponse
    return res.status(200).json({
      message: `Plante ${id} et ${photosDeleted} photo(s) supprimées.`,
      plant: result,
      photosDeleted
    })

  } catch (err) {
    console.error('🔥 error in deletePlante:', err)
    return res.status(500).json({ message: 'Erreur suppression plante' })
  }
}