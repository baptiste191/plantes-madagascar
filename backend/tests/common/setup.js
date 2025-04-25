// backend/tests/common/setup.js
const db     = require('../../src/config/db');
const bcrypt = require('bcrypt');

module.exports = async function resetDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // vide les tables
      db.run('DELETE FROM photos;');
      db.run('DELETE FROM plantes;');
      db.run('DELETE FROM utilisateurs;');

      // recrée 2 utilisateurs
      const hashAdmin  = bcrypt.hashSync('admin123', 10);
      const hashUser   = bcrypt.hashSync('utilisateur123', 10);
      db.run(
        'INSERT INTO utilisateurs (nom, mot_de_passe, role) VALUES (?,?,?)',
        ['admin', hashAdmin, 'admin']
      );
      db.run(
        'INSERT INTO utilisateurs (nom, mot_de_passe, role) VALUES (?,?,?)',
        ['utilisateur', hashUser, 'user']
      );

      resolve();
    });
  });
};
