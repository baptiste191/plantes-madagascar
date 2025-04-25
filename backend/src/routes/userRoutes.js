// backend/src/routes/userRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');

router.post('/login', ctrl.login);
router.use(auth);
router.get('/',    roles('admin'), ctrl.getAll);
router.post('/',   roles('admin'), ctrl.create);
router.delete('/:id', roles('admin'), ctrl.delete);

module.exports = router;
