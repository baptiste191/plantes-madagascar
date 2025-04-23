-- TABLE PLANTES
CREATE TABLE IF NOT EXISTS plantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_scientifique TEXT NOT NULL,
  nom_famille TEXT,
  nom_vernaculaire TEXT,
  regions TEXT,
  vertus TEXT,
  usages TEXT,
  parties_utilisees TEXT,
  mode_preparation TEXT,
  contre_indications TEXT,
  remarques TEXT,
  references_biblio TEXT
);

-- TABLE PHOTOS
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plante_id INTEGER NOT NULL,
  chemin_fichier TEXT NOT NULL,
  FOREIGN KEY (plante_id) REFERENCES plantes(id) ON DELETE CASCADE
);

-- TABLE UTILISATEURS
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_utilisateur TEXT UNIQUE NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  est_admin INTEGER DEFAULT 0
);
