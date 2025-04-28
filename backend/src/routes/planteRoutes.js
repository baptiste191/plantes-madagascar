// backend/src/routes/planteRoutes.js
const router   = require('express').Router();
const auth     = require('../middleware/auth');
const roles    = require('../middleware/roles');
const ctrl     = require('../controllers/planteController');

router.get('/',    auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/',   auth, roles('admin'), ctrl.create);
router.put('/:id', auth, roles('admin'), ctrl.update);
router.delete('/:id', auth, roles('admin'), ctrl.deletePlante);

module.exports = router;
