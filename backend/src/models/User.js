// backend/src/models/User.js
const db = require('../config/db');

module.exports = {
  findByNom: nom =>
    new Promise((res, rej) => {
      db.get(
        'SELECT * FROM utilisateurs WHERE nom = ?',
        [nom],
        (e, row) => (e ? rej(e) : res(row))
      );
    }),

    findById: id => new Promise((res, rej) => {
      db.get(
        `SELECT id, nom, role, derniere_connexion, nombre_connexion, description_utilisateur
         FROM utilisateurs WHERE id = ?`,
        [id],
        (e, row) => e ? rej(e) : res(row)
      );
    }),

    getAll: () => new Promise((res, rej) => {
      db.all(
        `SELECT id, nom, role, derniere_connexion, nombre_connexion, description_utilisateur
         FROM utilisateurs`,
        [],
        (e, rows) => e ? rej(e) : res(rows)
      );
    }),

    create: ({ nom, mot_de_passe, role, description_utilisateur }) => new Promise((res, rej) => {
      db.run(
        `INSERT INTO utilisateurs (nom, mot_de_passe, role, description_utilisateur)
         VALUES (?, ?, ?, ?)`,
        [nom, mot_de_passe, role || 'user', description_utilisateur || null],
        function(err) {
          if (err) return rej(err);
          res({ id: this.lastID });
        }
      );
    }),

  delete: id =>
    new Promise((res, rej) => {
      db.run('DELETE FROM utilisateurs WHERE id = ?', [id], function (err) {
        if (err) return rej(err);
        res({ changes: this.changes });
      });
    }),

  updateLoginStats: id =>
    new Promise((res, rej) => {
      const now = new Date().toISOString();
      db.run(
        'UPDATE utilisateurs SET derniere_connexion = ?, nombre_connexion = nombre_connexion + 1 WHERE id = ?',
        [now, id],
        function (err) {
          if (err) return rej(err);
          res({ changes: this.changes });
        }
      );
    }),

    update: ({ id, nom, mot_de_passe, description_utilisateur }) => new Promise((res, rej) => {
      const sets = ['nom = ?', 'description_utilisateur = ?'];
      const params = [nom, description_utilisateur];
      if (mot_de_passe) {
        sets.push('mot_de_passe = ?');
        params.push(mot_de_passe);
      }
      params.push(id);
      db.run(
        `UPDATE utilisateurs SET ${sets.join(', ')} WHERE id = ?`,
        params,
        function(err) {
          if (err) return rej(err);
          res({ changes: this.changes });
        }
      );
    })
};
