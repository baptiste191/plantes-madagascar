const db = require('../config/db')

const Photo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all('SELECT * FROM photos', (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    }),

  getByPlante: plante_id =>
    new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM photos WHERE plante_id = ?',
        [plante_id],
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    }),

  create: ({ filename, plante_id }) =>
    new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO photos (filename, plante_id) VALUES (?, ?)',
        [filename, plante_id],
        function (err) {
          if (err) return reject(err)
          resolve({ id: this.lastID })
        }
      )
    }),

  delete: id =>
    new Promise((resolve, reject) => {
      db.run('DELETE FROM photos WHERE id = ?', [id], function (err) {
        if (err) return reject(err)
        resolve({ changes: this.changes })
      })
    }),
}

module.exports = Photo
