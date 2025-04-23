CREATE TABLE plantes (
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
