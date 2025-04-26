// backend/src/controllers/photoController.js
const Photo = require('../models/Photo')
const logger = require('../utils/logger')

exports.getPhotos = async (req, res) => {
  try {
    const { plante_id } = req.query
    const photos = plante_id
      ? await Photo.getByPlante(parseInt(plante_id, 10))
      : await Photo.getAll()
    return res.status(200).json(photos)
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Erreur serveur photos' })
  }
}

exports.upload = async (req, res) => {
  try {
    const { filename } = req.file
    const plante_id = parseInt(req.body.plante_id, 10)
    const newPhoto = await Photo.create({ filename, plante_id })
    return res.status(201).json(newPhoto)
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Erreur upload photo' })
  }
}

exports.deletePhoto = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const result = await Photo.delete(id)
    return res.status(200).json(result)
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Erreur suppression photo' })
  }
}
