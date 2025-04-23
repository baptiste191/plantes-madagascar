CREATE TABLE utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_utilisateur TEXT UNIQUE NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  est_admin INTEGER DEFAULT 0
);
