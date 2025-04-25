// backend/src/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const fs      = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH
  || path.join(__dirname, '../../db/database.sqlite');
// assure que le dossier existe
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Erreur connexion BD :', err);
    process.exit(1);
  }
});

// création des tables si besoin
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin','user')) NOT NULL DEFAULT 'user',
    derniere_connexion TEXT,
    nombre_connexion INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS plantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_scientifique TEXT NOT NULL,
    famille TEXT,
    nom_vernaculaire TEXT,
    regions TEXT,
    vertus TEXT,
    usages TEXT,
    parties_utilisees TEXT,
    mode_preparation TEXT,
    contre_indications TEXT,
    remarques TEXT,
    bibliographie TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    plante_id INTEGER,
    FOREIGN KEY(plante_id) REFERENCES plantes(id) ON DELETE CASCADE
  )`);
});

module.exports = db;
