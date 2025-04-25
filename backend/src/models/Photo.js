// backend/src/models/Photo.js
const db = require('../config/db');

module.exports = {
  getByPlante: plante_id => new Promise((res, rej) => {
    db.all(
      'SELECT * FROM photos WHERE plante_id = ?',
      [plante_id],
      (e, rows) => e ? rej(e) : res(rows)
    );
  }),

  create: ({ filename, plante_id }) => new Promise((res, rej) => {
    db.run(
      'INSERT INTO photos (filename, plante_id) VALUES (?, ?)',
      [filename, plante_id],
      function(err) {
        if (err) return rej(err);
        res({ id: this.lastID });
      }
    );
  }),

  delete: id => new Promise((res, rej) => {
    db.run('DELETE FROM photos WHERE id = ?', [id], function(err) {
      if (err) return rej(err);
      res({ changes: this.changes });
    });
  })
};
