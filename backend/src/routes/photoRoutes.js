// backend/src/routes/photoRoutes.js
const express     = require('express')
const path        = require('path')
const fs          = require('fs')
const multer      = require('multer')
const verifyToken = require('../middleware/auth')
const roles       = require('../middleware/roles')
const ctrl        = require('../controllers/photoController')
const PhotoModel  = require('../models/Photo')

const router = express.Router()

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../../db/photos')),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png']
    cb(null, allowed.includes(file.mimetype))
  }
})

// 1) GET /api/photos?plante_id=…
router.get('/', verifyToken, ctrl.getPhotos)

// 2) POST /api/photos  (admin only, max 4 photos)
router.post(
  '/',
  verifyToken,
  roles('admin'),

  // Multer parse d'abord le form-data (remplit req.body et req.file)
  (req, res, next) => {
    upload.single('photo')(req, res, err => {
      if (err) return res.status(400).json({ error: err.message })
      next()
    })
  },

  // Puis on vérifie qu'il y a moins de 4 photos pour cette plante
  async (req, res, next) => {
    const pid = parseInt(req.body.plante_id, 10)
    const existing = await PhotoModel.getByPlante(pid)
    if (existing.length >= 4) {
      // retire le fichier uploadé pour éviter les restes sur le disque
      if (req.file && req.file.path) {
        try { fs.unlinkSync(req.file.path) } catch {}
      }
      return res
        .status(400)
        .json({ message: 'Limite de 4 photos atteinte pour cette plante.' })
    }
    next()
  },

  // Enfin, on sauvegarde en base
  ctrl.upload
)

// 3) DELETE /api/photos/:id  (admin only)
router.delete('/:id', verifyToken, roles('admin'), ctrl.deletePhoto)

module.exports = router
