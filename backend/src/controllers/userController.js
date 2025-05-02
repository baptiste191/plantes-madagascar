// backend/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { nom, mot_de_passe } = req.body;
    const user = await User.findByNom(nom);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Met à jour les stats de connexion
    await User.updateLoginStats(user.id);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: { id: user.id, nom: user.nom, role: user.role }
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Erreur serveur lors du login' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.getAll();
    // on ne veut pas afficher les admins
    users = users.filter(u => u.role !== 'admin');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(parseInt(id,10));
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nom, mot_de_passe, role, description_utilisateur } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await User.create({ nom, mot_de_passe: hash, role, description_utilisateur });
    res.status(201).json(result);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Erreur serveur à la création' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let { nom, mot_de_passe, description_utilisateur } = req.body;

    // Si on veut changer le mot de passe, on le hash
    if (mot_de_passe) {
      const saltRounds = 10;
      mot_de_passe = await bcrypt.hash(mot_de_passe, saltRounds);
    }

    const result = await User.update({ id, nom, mot_de_passe, description_utilisateur });
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Aucune modification effectuée' });
    }
    res.json({ message: 'Utilisateur modifié', changes: result.changes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la modification' });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await User.delete(id);
    if (result.changes === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(result);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Erreur serveur à la suppression' });
  }
};
