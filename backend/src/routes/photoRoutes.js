// backend/src/routes/photoRoutes.js
const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');
const ctrl   = require('../controllers/photoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../../db/photos')),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg','image/png'];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Type non autorisé'), false);
  }
});

router.get('/', auth, ctrl.getByPlante);

// wrap Multer to catch errors
router.post(
  '/',
  auth,
  roles('admin'),
  (req, res, next) => {
    upload.single('photo')(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  ctrl.upload
);

router.delete('/:id', auth, roles('admin'), ctrl.delete);

module.exports = router;
