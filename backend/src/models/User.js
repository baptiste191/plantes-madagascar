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

    findById: id =>
      new Promise((res, rej) => {
        db.get(
          `SELECT 
             id,
             nom,
             role,
             description_utilisateur,
             derniere_connexion,
             nombre_connexion
           FROM utilisateurs
           WHERE id = ?`,
          [id],
          (e, row) => e ? rej(e) : res(row)
        )
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

  update: ({ id, nom, mot_de_passe, description_utilisateur }) =>
    new Promise((resolve, reject) => {
      const fields = []
      const params = []

      if (nom !== undefined) {
        fields.push('nom = ?')
        params.push(nom)
      }
      if (mot_de_passe !== undefined) {
        fields.push('mot_de_passe = ?')
        params.push(mot_de_passe)
      }
      if (description_utilisateur !== undefined) {
        fields.push('description_utilisateur = ?')
        params.push(description_utilisateur)
      }

      // rien à mettre à jour ?
      if (fields.length === 0) {
        return resolve({ changes: 0 })
      }

      // on construit la requête
      const sql = `UPDATE utilisateurs SET ${fields.join(', ')} WHERE id = ?`
      params.push(id)

      db.run(sql, params, function(err) {
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    })
};
