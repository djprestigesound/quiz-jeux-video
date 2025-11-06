-- Script d'initialisation PostgreSQL pour Neon
-- À exécuter dans la console SQL de Neon

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de quiz
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id TEXT PRIMARY KEY,
  player_name TEXT,
  qr_code TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0
);

-- Table des réponses
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  user_answer CHAR(1),
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Insérer les questions de démonstration
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
('Dans quel jeu incarne-t-on un plombier moustachu ?', 'Sonic', 'Mario', 'Crash Bandicoot', 'Rayman', 'B', 'Personnages'),
('Quel est le nom du hérisson bleu ultra-rapide de SEGA ?', 'Flash', 'Speedy', 'Sonic', 'Dash', 'C', 'Personnages'),
('Dans Pac-Man, quelle est la couleur du fantôme Blinky ?', 'Rouge', 'Rose', 'Bleu', 'Orange', 'A', 'Classiques'),
('Quel jeu se déroule dans un monde fait de blocs carrés ?', 'Roblox', 'Minecraft', 'Fortnite', 'Terraria', 'B', 'Mondes ouverts'),
('Dans quel jeu doit-on attraper des Pokémon ?', 'Digimon', 'Yokai Watch', 'Pokémon', 'Monster Hunter', 'C', 'Pokémon'),
('Quel jeu de course met en scène Mario et ses amis ?', 'Mario Kart', 'Need for Speed', 'Gran Turismo', 'F1', 'A', 'Course'),
('Dans Tetris, que se passe-t-il quand une ligne est complète ?', 'Elle clignote', 'Elle disparaît', 'Elle change de couleur', 'Rien', 'B', 'Classiques'),
('Quel est le nom de la princesse que Mario doit sauver ?', 'Zelda', 'Daisy', 'Peach', 'Rosalina', 'C', 'Personnages'),
('Dans quel jeu Link est-il le héros principal ?', 'The Legend of Zelda', 'Final Fantasy', 'Dragon Quest', 'Kingdom Hearts', 'A', 'Aventure'),
('Quel jeu de battle royale est devenu extrêmement populaire ?', 'Apex Legends', 'PUBG', 'Fortnite', 'Call of Duty Warzone', 'C', 'Battle Royale'),
('Quelle console a été créée par Nintendo en 2017 ?', 'Wii U', 'Switch', '3DS', 'GameCube', 'B', 'Consoles'),
('Dans les Sims, que contrôle le joueur ?', 'Des animaux', 'Des voitures', 'La vie de personnages', 'Une ville', 'C', 'Simulation'),
('Quel jeu de danse utilise un tapis de danse ?', 'Just Dance', 'Dance Dance Revolution', 'Guitar Hero', 'Rock Band', 'B', 'Musique'),
('Dans Angry Birds, que lance-t-on sur les cochons ?', 'Des pierres', 'Des oiseaux', 'Des bombes', 'Des œufs', 'B', 'Mobile'),
('Quel jeu de football est développé par EA Sports ?', 'PES', 'FIFA', 'Football Manager', 'Rocket League', 'B', 'Sport'),
('Dans quel jeu incarne-t-on Lara Croft ?', 'Uncharted', 'Assassin''s Creed', 'Tomb Raider', 'Far Cry', 'C', 'Aventure'),
('Quel jeu permet de créer et gérer un parc d''attractions ?', 'SimCity', 'Cities Skylines', 'RollerCoaster Tycoon', 'Theme Hospital', 'C', 'Gestion'),
('Dans Street Fighter, quelle est l''attaque signature de Ryu ?', 'Sonic Boom', 'Flash Kick', 'Hadouken', 'Shoryuken', 'C', 'Combat'),
('Quel jeu se passe dans la ville de Los Santos ?', 'GTA V', 'Saints Row', 'Mafia', 'Watch Dogs', 'A', 'Action'),
('Dans Candy Crush, quel est l''objectif principal ?', 'Construire une ville', 'Aligner des bonbons', 'Nourrir un animal', 'Résoudre des énigmes', 'B', 'Puzzle');
