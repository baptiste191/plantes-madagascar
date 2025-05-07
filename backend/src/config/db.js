// backend/src/config/db.js
require('dotenv').config()
const path    = require('path')
const sqlite3 = require('sqlite3').verbose()

// 1) On considère que DB_FILE est un chemin relatif à la racine de backend/
//    par défaut "db/database.sqlite"
const dbRelative = process.env.DB_FILE || 'db/database.sqlite'

// 2) __dirname === .../backend/src/config
//    on remonte 2 niveaux pour arriver sur .../backend
const projectRoot = path.resolve(__dirname, '..', '..')

// 3) on combine racine + chemin relatif
const dbPath = path.resolve(__dirname, '../../db/database.sqlite');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    console.error('❌ Impossible d’ouvrir/créer la base de données:', err)
  } else {
    console.log(`✅ Base SQLite chargée : ${dbPath}`)
  }
})


// Création des tables si besoin
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE,
    description_utilisateur TEXT,
    mot_de_passe TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin','user')) NOT NULL DEFAULT 'user',
    derniere_connexion TEXT,
    nombre_connexion INTEGER DEFAULT 0
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS plantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_scientifique TEXT NOT NULL,
    famille TEXT,
    nom_vernaculaire TEXT,
    endemique INTEGER NOT NULL DEFAULT 0,
    regions TEXT,
    vertus TEXT,
    usages TEXT,
    parties_utilisees TEXT,
    mode_preparation TEXT,
    contre_indications TEXT,
    remarques TEXT,
    bibliographie TEXT
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    plante_id INTEGER,
    FOREIGN KEY(plante_id) REFERENCES plantes(id) ON DELETE CASCADE
  )`)
})

module.exports = db
