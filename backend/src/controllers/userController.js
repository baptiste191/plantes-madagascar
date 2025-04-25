// backend/src/controllers/userController.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const logger = require('../utils/logger');
require('dotenv').config();

exports.login = async (req, res) => {
  try {
    const { nom, mot_de_passe } = req.body;
    const user = await User.findByNom(nom);
    if (!user)
      return res.status(401).json({ message: 'Utilisateur introuvable' });

    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!match)
      return res.status(401).json({ message: 'Mot de passe incorrect' });

    await User.updateLoginStats(user.id);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user.id, nom: user.nom, role: user.role } });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.getAll = async (_, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, mot_de_passe, role } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await User.create({ nom, mot_de_passe: hash, role });
    res.status(201).json(result);
  } catch (e) {
    logger.error(e);
    res.status(400).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(result);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: e.message });
  }
};
