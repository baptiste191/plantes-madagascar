// backend/src/routes/photoRoutes.js
const express       = require('express')
const path          = require('path')
const multer        = require('multer')
const verifyToken   = require('../middleware/auth')
const roles         = require('../middleware/roles')
const ctrl          = require('../controllers/photoController')

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

// 1) GET /api/photos?plante_id=…  ou  /api/photos
router.get('/', verifyToken, ctrl.getPhotos)

// 2) POST /api/photos      (admin only)
router.post(
  '/',
  verifyToken,
  roles('admin'),
  (req, res, next) => {
    upload.single('photo')(req, res, err => {
      if (err) return res.status(400).json({ error: err.message })
      next()
    })
  },
  ctrl.upload
)

// 3) DELETE /api/photos/:id  (admin only)
router.delete('/:id', verifyToken, roles('admin'), ctrl.deletePhoto)

module.exports = router
