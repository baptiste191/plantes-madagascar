// backend/src/models/Photo.js
const db   = require('../config/db');
const fs   = require('fs');
const path = require('path');

const Photo = {
  // Toutes les photos
  getAll: () =>
    new Promise((res, rej) => {
      db.all('SELECT * FROM photos', (err, rows) =>
        err ? rej(err) : res(rows)
      );
    }),

  // Par plante
  getByPlante: plante_id =>
    new Promise((res, rej) => {
      db.all(
        'SELECT * FROM photos WHERE plante_id = ?',
        [plante_id],
        (err, rows) => err ? rej(err) : res(rows)
      );
    }),

  // Par id (pour récupérer filename avant suppression)
  getById: id =>
    new Promise((res, rej) => {
      db.get(
        'SELECT * FROM photos WHERE id = ?',
        [id],
        (err, row) => err ? rej(err) : res(row)
      );
    }),

  // Création
  create: ({ filename, plante_id }) =>
    new Promise((res, rej) => {
      db.run(
        'INSERT INTO photos (filename, plante_id) VALUES (?, ?)',
        [filename, plante_id],
        function(err) {
          if (err) return rej(err);
          res({ id: this.lastID });
        }
      );
    }),

  // Suppression en base
  delete: id =>
    new Promise((res, rej) => {
      db.run(
        'DELETE FROM photos WHERE id = ?',
        [id],
        function(err) {
          if (err) return rej(err);
          res({ changes: this.changes });
        }
      );
    }),

  deleteByPlante: plante_id =>
    new Promise((res, rej) => {
    db.run(
      'DELETE FROM photos WHERE plante_id = ?',
      [plante_id],
      function(err) {
        if (err) return rej(err);
        res({ changes: this.changes });
      }
    );
  }),

  // Optionnel : suppression fichier + base (si tu veux centraliser)
  deleteWithFile: async id => {
    const photo = await Photo.getById(id);
    if (photo && photo.filename) {
      const p = path.join(__dirname, '../../db/photos', photo.filename);
      try { fs.unlinkSync(p) } catch {}
    }
    return Photo.delete(id);
  }
};

module.exports = Photo;
