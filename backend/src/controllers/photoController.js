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
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }
    const { filename } = req.file;
    const plante_id    = parseInt(req.body.plante_id, 10);
    const newPhoto     = await Photo.create({ filename, plante_id });
    return res.status(201).json(newPhoto);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Erreur upload photo' });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    // 1) Linux/Mac : si tu veux aussi supprimer le fichier localement,
    //    ajoute ici un unlinkSync. Sinon on se contente de la BDD :

    const dbPhotos = await Photo.getByPlante(id)  // si tu stockes filename tu peux supprimer le fichier
    dbPhotos.forEach(p => fs.unlinkSync(path.join(__dirname,'../../db/photos', p.filename)))

    // 2) Supprime la ligne en base
    const { changes } = await Photo.deleteById(id)

    if (changes === 0) {
      return res.status(404).json({ message: 'Photo non trouvée' })
    }

    res.status(200).json({ changes })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'Erreur suppression photo' })
  }
}
