const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'quiz.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('🔄 Migration : Ajout des tables pour les événements de quiz...');

  // Table des événements de quiz
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quiz_id INTEGER NOT NULL,
      status TEXT DEFAULT 'waiting',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      started_at DATETIME,
      finished_at DATETIME
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur création table quiz_events:', err);
    } else {
      console.log('✅ Table quiz_events créée');
    }
  });

  // Table des participants en attente
  db.run(`
    CREATE TABLE IF NOT EXISTS event_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES quiz_events(id),
      UNIQUE(event_id, player_name)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erreur création table event_participants:', err);
    } else {
      console.log('✅ Table event_participants créée');
    }
  });

  // Ajouter la colonne quiz_id dans quiz_sessions si elle n'existe pas
  db.run(`
    ALTER TABLE quiz_sessions ADD COLUMN quiz_id INTEGER DEFAULT 1
  `, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('❌ Erreur ajout colonne quiz_id:', err);
    } else {
      console.log('✅ Colonne quiz_id ajoutée à quiz_sessions');
    }
  });

  // Ajouter la colonne event_id dans quiz_sessions si elle n'existe pas
  db.run(`
    ALTER TABLE quiz_sessions ADD COLUMN event_id INTEGER
  `, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('❌ Erreur ajout colonne event_id:', err);
    } else {
      console.log('✅ Colonne event_id ajoutée à quiz_sessions');
      console.log('\n🎉 Migration terminée avec succès !');
    }
  });
});

db.close();
