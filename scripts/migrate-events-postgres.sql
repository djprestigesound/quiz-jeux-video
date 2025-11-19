-- Migration PostgreSQL : Ajout des tables pour les événements
-- À exécuter sur Vercel Postgres ou Neon

-- Table des événements de quiz
CREATE TABLE IF NOT EXISTS quiz_events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  quiz_id INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);

-- Table des participants en attente
CREATE TABLE IF NOT EXISTS event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES quiz_events(id),
  UNIQUE(event_id, player_name)
);

-- Ajouter la colonne quiz_id dans quiz_sessions (si elle n'existe pas)
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS quiz_id INTEGER DEFAULT 1;

-- Ajouter la colonne event_id dans quiz_sessions (si elle n'existe pas)
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS event_id INTEGER;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_quiz_events_status ON quiz_events(status);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_event_id ON quiz_sessions(event_id);
