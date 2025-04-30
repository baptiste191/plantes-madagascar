// backend/src/routes/userRoutes.js
const express      = require('express');
const verifyToken  = require('../middleware/auth');
const roles        = require('../middleware/roles');
const ctrl         = require('../controllers/userController');

const router = express.Router();

// Auth
router.post('/login', ctrl.login);

// CRUD utilisateurs (seulement admin)
router.get('/',    verifyToken, roles('admin'), ctrl.getAllUsers);
router.post('/',   verifyToken, roles('admin'), ctrl.createUser);
router.get('/:id', verifyToken, roles('admin'), ctrl.getUserById);
router.put('/:id', verifyToken, roles('admin'), ctrl.updateUser);
router.delete('/:id', verifyToken, roles('admin'), ctrl.deleteUser);

module.exports = router;
