// backend/src/middleware/roles.js
module.exports = requiredRole => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
    if (req.user.role !== requiredRole)
      return res.status(403).json({ message: 'Accès refusé' });
    next();
  };
  