const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

const playerNames = [
  'Mario64', 'Sonic_Speed', 'Link_Hero', 'Cloud_FF7', 'Lara_Croft',
  'MasterChief', 'Kratos_GOW', 'Pikachu25', 'Zelda_Fan', 'Megaman_X',
  'Samus_Aran', 'Snake_MGS', 'Ryu_SF', 'Crash_Bandicoot', 'Spyro_Dragon',
  'DoomSlayer', 'Gordon_Freeman', 'Ezio_AC', 'Nathan_Drake', 'Joel_TLOU',
  'Ellie_Williams', 'Aloy_HZD', 'Geralt_Witcher', 'Shepard_ME', 'Arthur_Morgan',
  'Luigi_Bro', 'Yoshi_Island', 'Kirby_Pink', 'Fox_McCloud', 'Sora_KH',
  'Dante_DMC', 'Bayonetta', 'Rayman_Legends', 'Banjo_Kazooie', 'Conker_Squirrel',
  'Sam_Fisher', 'Solid_Snake', 'Big_Boss', 'Raiden_MGR', 'Naked_Snake',
  'Cortana_AI', 'GLaDOS_Portal', 'Wheatley_Core', 'Chell_Silent', 'Duke_Nukem',
  'Doomguy_93', 'BJ_Blazkowicz', 'Ranger_Quake', 'Corvus_Heretic', 'Caleb_Blood'
];

async function simulatePlayers(numberOfPlayers) {
  try {
    console.log(`🎮 Simulation de ${numberOfPlayers} joueurs...`);
    console.log('');

    for (let i = 0; i < numberOfPlayers; i++) {
      const playerName = playerNames[i % playerNames.length] + (i >= playerNames.length ? `_${Math.floor(i / playerNames.length) + 1}` : '');
      const totalQuestions = 20;

      // Score aléatoire entre 30% et 100% de bonnes réponses
      const minCorrect = Math.floor(totalQuestions * 0.3);
      const maxCorrect = totalQuestions;
      const correctAnswers = Math.floor(Math.random() * (maxCorrect - minCorrect + 1)) + minCorrect;

      // Calcul du score (50 points par bonne réponse)
      const score = correctAnswers * 50;

      // Temps aléatoire entre 5 et 15 minutes
      const completionTime = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

      // Générer un ID unique pour la session
      const sessionId = `sim_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;

      // Insérer dans la base de données
      await pool.query(`
        INSERT INTO quiz_sessions (
          id,
          player_name,
          score,
          total_questions,
          correct_answers,
          started_at,
          completed_at
        ) VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${completionTime} minutes', NOW())
      `, [sessionId, playerName, score, totalQuestions, correctAnswers]);

      console.log(`✅ ${i + 1}/${numberOfPlayers} - ${playerName} | Score: ${score} (${correctAnswers}/${totalQuestions})`);
    }

    console.log('');
    console.log('🏆 Simulation terminée !');
    console.log('');

    // Afficher le TOP 10
    const leaderboard = await pool.query(`
      SELECT
        player_name,
        score,
        correct_answers,
        total_questions
      FROM quiz_sessions
      ORDER BY score DESC, completed_at ASC
      LIMIT 10
    `);

    console.log('📊 TOP 10 :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    leaderboard.rows.forEach((player, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      console.log(`${medal.padEnd(4)} ${player.player_name.padEnd(20)} ${player.score.toString().padStart(5)} pts (${player.correct_answers}/${player.total_questions})`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await pool.end();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Nombre de joueurs à simuler (défaut: 50)
const numberOfPlayers = parseInt(process.argv[2]) || 50;
simulatePlayers(numberOfPlayers);
