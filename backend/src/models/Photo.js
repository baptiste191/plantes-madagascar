// backend/src/models/Photo.js
const db = require('../config/db')

module.exports = {
  // toutes les photos
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all('SELECT * FROM photos', (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    }),

  // photos d'une plante donnée
  getByPlante: (plante_id) =>
    new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM photos WHERE plante_id = ?',
        [plante_id],
        (err, rows) => {
          if (err) return reject(err)
          resolve(rows)
        }
      )
    }),

  // création
  create: ({ filename, plante_id }) =>
    new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO photos (filename, plante_id) VALUES (?, ?)',
        [filename, plante_id],
        function(err) {
          if (err) return reject(err)
          resolve({ id: this.lastID })
        }
      )
    }),

  // efface une photo par son ID
  deleteById: (id) =>
    new Promise((resolve, reject) => {
      db.run('DELETE FROM photos WHERE id = ?', [id], function(err) {
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    }),

  // efface toutes les photos d'une plante
  deleteByPlante: (plante_id) =>
    new Promise((resolve, reject) => {
      db.run('DELETE FROM photos WHERE plante_id = ?', [plante_id], function(err) {
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    }),
}
