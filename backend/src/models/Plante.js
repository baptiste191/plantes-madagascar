// backend/src/models/Plante.js
const db = require('../config/db');

module.exports = {
  getAll: ({ nom, vertu, region }) => new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM plantes';
    const clauses = [], params = [];
    if (nom)    { clauses.push('nom_scientifique LIKE ?'); params.push(`%${nom}%`); }
    if (vertu)  { clauses.push('vertus LIKE ?');              params.push(`%${vertu}%`); }
    if (region) { clauses.push('regions LIKE ?');             params.push(`%${region}%`); }
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    db.all(sql, params, (e, rows) => e ? reject(e) : resolve(rows));
  }),

  getById: id => new Promise((res, rej) => {
    db.get('SELECT * FROM plantes WHERE id = ?', [id], (e, row) =>
      e ? rej(e) : res(row)
    );
  }),

  create: p => new Promise((res, rej) => {
    const cols = [
      'nom_scientifique','famille','nom_vernaculaire','regions','vertus',
      'usages','parties_utilisees','mode_preparation',
      'contre_indications','remarques','bibliographie','endemique'
    ];
    const placeholders = cols.map(() => '?').join(',');
    const vals = cols.map(c => p[c]);
    db.run(
      `INSERT INTO plantes (${cols.join(',')}) VALUES (${placeholders})`,
      vals,
      function(err) {
        if (err) return rej(err);
        res({ id: this.lastID });
      }
    );
  }),

  update: (id, p) => new Promise((res, rej) => {
    const cols = [
      'nom_scientifique','famille','nom_vernaculaire','regions','vertus',
      'usages','parties_utilisees','mode_preparation',
      'contre_indications','remarques','bibliographie','endemique'
    ];
    const assignments = cols.map(c => `${c} = ?`).join(',');
    const vals = cols.map(c => p[c] ?? 0);
    vals.push(id);
    db.run(
      `UPDATE plantes SET ${assignments} WHERE id = ?`,
      vals,
      function(err) {
        if (err) return rej(err);
        res({ changes: this.changes });
      }
    );
  }),

  delete: id => new Promise((res, rej) => {
    db.run('DELETE FROM plantes WHERE id = ?', [id], function(err) {
      if (err) return rej(err);
      res({ changes: this.changes });
    });
  })
};
