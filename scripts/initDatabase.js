const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'database');
const dbPath = path.join(dbDir, 'quiz.db');

// Créer le dossier database s'il n'existe pas
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Table des questions
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer CHAR(1) NOT NULL,
      difficulty TEXT DEFAULT 'medium',
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des sessions de quiz
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id TEXT PRIMARY KEY,
      player_name TEXT,
      qr_code TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      score INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0
    )
  `);

  // Table des réponses
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer CHAR(1),
      is_correct BOOLEAN,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES quiz_sessions(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `);

  // Insérer des questions de démonstration
  const demoQuestions = [
    {
      question: "Dans quel jeu incarne-t-on un plombier moustachu ?",
      a: "Sonic", b: "Mario", c: "Crash Bandicoot", d: "Rayman",
      correct: "B", category: "Personnages"
    },
    {
      question: "Quel est le nom du hérisson bleu ultra-rapide de SEGA ?",
      a: "Flash", b: "Speedy", c: "Sonic", d: "Dash",
      correct: "C", category: "Personnages"
    },
    {
      question: "Dans Pac-Man, quelle est la couleur du fantôme Blinky ?",
      a: "Rouge", b: "Rose", c: "Bleu", d: "Orange",
      correct: "A", category: "Classiques"
    },
    {
      question: "Quel jeu se déroule dans un monde fait de blocs carrés ?",
      a: "Roblox", b: "Minecraft", c: "Fortnite", d: "Terraria",
      correct: "B", category: "Mondes ouverts"
    },
    {
      question: "Dans quel jeu doit-on attraper des Pokémon ?",
      a: "Digimon", b: "Yokai Watch", c: "Pokémon", d: "Monster Hunter",
      correct: "C", category: "Pokémon"
    },
    {
      question: "Quel jeu de course met en scène Mario et ses amis ?",
      a: "Mario Kart", b: "Need for Speed", c: "Gran Turismo", d: "F1",
      correct: "A", category: "Course"
    },
    {
      question: "Dans Tetris, que se passe-t-il quand une ligne est complète ?",
      a: "Elle clignote", b: "Elle disparaît", c: "Elle change de couleur", d: "Rien",
      correct: "B", category: "Classiques"
    },
    {
      question: "Quel est le nom de la princesse que Mario doit sauver ?",
      a: "Zelda", b: "Daisy", c: "Peach", d: "Rosalina",
      correct: "C", category: "Personnages"
    },
    {
      question: "Dans quel jeu Link est-il le héros principal ?",
      a: "The Legend of Zelda", b: "Final Fantasy", c: "Dragon Quest", d: "Kingdom Hearts",
      correct: "A", category: "Aventure"
    },
    {
      question: "Quel jeu de battle royale est devenu extrêmement populaire ?",
      a: "Apex Legends", b: "PUBG", c: "Fortnite", d: "Call of Duty Warzone",
      correct: "C", category: "Battle Royale"
    },
    {
      question: "Quelle console a été créée par Nintendo en 2017 ?",
      a: "Wii U", b: "Switch", c: "3DS", d: "GameCube",
      correct: "B", category: "Consoles"
    },
    {
      question: "Dans les Sims, que contrôle le joueur ?",
      a: "Des animaux", b: "Des voitures", c: "La vie de personnages", d: "Une ville",
      correct: "C", category: "Simulation"
    },
    {
      question: "Quel jeu de danse utilise un tapis de danse ?",
      a: "Just Dance", b: "Dance Dance Revolution", c: "Guitar Hero", d: "Rock Band",
      correct: "B", category: "Musique"
    },
    {
      question: "Dans Angry Birds, que lance-t-on sur les cochons ?",
      a: "Des pierres", b: "Des oiseaux", c: "Des bombes", d: "Des œufs",
      correct: "B", category: "Mobile"
    },
    {
      question: "Quel jeu de football est développé par EA Sports ?",
      a: "PES", b: "FIFA", c: "Football Manager", d: "Rocket League",
      correct: "B", category: "Sport"
    },
    {
      question: "Dans quel jeu incarne-t-on Lara Croft ?",
      a: "Uncharted", b: "Assassin's Creed", c: "Tomb Raider", d: "Far Cry",
      correct: "C", category: "Aventure"
    },
    {
      question: "Quel jeu permet de créer et gérer un parc d'attractions ?",
      a: "SimCity", b: "Cities Skylines", c: "RollerCoaster Tycoon", d: "Theme Hospital",
      correct: "C", category: "Gestion"
    },
    {
      question: "Dans Street Fighter, quelle est l'attaque signature de Ryu ?",
      a: "Sonic Boom", b: "Flash Kick", c: "Hadouken", d: "Shoryuken",
      correct: "C", category: "Combat"
    },
    {
      question: "Quel jeu se passe dans la ville de Los Santos ?",
      a: "GTA V", b: "Saints Row", c: "Mafia", d: "Watch Dogs",
      correct: "A", category: "Action"
    },
    {
      question: "Dans Candy Crush, quel est l'objectif principal ?",
      a: "Construire une ville", b: "Aligner des bonbons", c: "Nourrir un animal", d: "Résoudre des énigmes",
      correct: "B", category: "Puzzle"
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  demoQuestions.forEach(q => {
    stmt.run(q.question, q.a, q.b, q.c, q.d, q.correct, q.category);
  });

  stmt.finalize();

  console.log('✅ Base de données initialisée avec succès !');
  console.log(`📊 ${demoQuestions.length} questions ajoutées`);
});

db.close();
