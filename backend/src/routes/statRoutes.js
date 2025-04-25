// backend/src/routes/statRoutes.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');
const ctrl   = require('../controllers/statController');

router.use(auth, roles('admin'));
router.get('/total-plantes', ctrl.countPlantes);
router.get('/par-region',    ctrl.byRegion);
router.get('/par-vertu',     ctrl.byVertu);
router.get('/connexions',    ctrl.connexions);

module.exports = router;
