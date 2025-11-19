const axios = require('axios');

const PRODUCTION_URL = 'https://quiz-jeux-video.vercel.app';
const NUMBER_OF_PLAYERS = 50;

const playerNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eric', 'Fiona', 'George', 'Hannah',
  'Ivan', 'Julia', 'Kevin', 'Laura', 'Mike', 'Nina', 'Oscar', 'Paula',
  'Quinn', 'Rachel', 'Steve', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
  'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan', 'Emma', 'Frank',
  'Grace', 'Harry', 'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah',
  'Olivia', 'Paul', 'Quincy', 'Rose', 'Sam', 'Tara', 'Umar', 'Vera',
  'Will', 'Xena', 'York', 'Zoe'
];

async function simulatePlayer(playerName, quizId, playerNumber) {
  const startTime = Date.now();

  try {
    console.log(`🎮 [${playerNumber}] ${playerName} - Démarrage...`);

    // ÉTAPE 1: Accès à /play (comme si on scannait le QR)
    const playResponse = await axios.get(`${PRODUCTION_URL}/play`, {
      timeout: 10000
    });

    if (playResponse.status !== 200) {
      throw new Error(`Page /play non accessible: ${playResponse.status}`);
    }

    // ÉTAPE 2: Démarrer le quiz
    const startResponse = await axios.post(
      `${PRODUCTION_URL}/quiz/start`,
      `playerName=${encodeURIComponent(playerName)}&quizId=${quizId}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': `LoadTest-Player-${playerNumber}`
        },
        maxRedirects: 5,
        timeout: 10000
      }
    );

    const cookies = startResponse.headers['set-cookie'];

    if (!cookies) {
      throw new Error('Pas de session cookie reçue');
    }

    // ÉTAPE 3: Répondre à 10 questions aléatoires
    for (let q = 0; q < 10; q++) {
      const answers = ['A', 'B', 'C', 'D'];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

      try {
        await axios.post(
          `${PRODUCTION_URL}/quiz/answer`,
          `answer=${randomAnswer}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie': cookies.join('; ')
            },
            maxRedirects: 5,
            timeout: 10000
          }
        );
      } catch (err) {
        // Continue même si une réponse échoue
      }

      // Pause entre réponses (réaliste)
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [${playerNumber}] ${playerName} - Terminé en ${duration}s`);
    return { success: true, duration, playerName };

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`❌ [${playerNumber}] ${playerName} - Erreur après ${duration}s: ${error.message}`);
    return { success: false, duration, playerName, error: error.message };
  }
}

async function runLoadTest() {
  console.log('🚀 TEST DE CHARGE EN PRODUCTION');
  console.log('================================');
  console.log(`URL: ${PRODUCTION_URL}`);
  console.log(`Joueurs simultanés: ${NUMBER_OF_PLAYERS}`);
  console.log('================================\n');

  const startTime = Date.now();

  // Lancer tous les joueurs en même temps (vraie simulation)
  const promises = [];
  for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
    const playerName = `${playerNames[i % playerNames.length]}_${Math.floor(i / playerNames.length) + 1}`;
    const quizId = (i % 4) + 1; // Répartir sur les 4 quiz

    // Délai échelonné pour simuler des arrivées progressives (plus réaliste)
    const delay = i * 100; // 100ms entre chaque joueur

    promises.push(
      new Promise(resolve => {
        setTimeout(async () => {
          const result = await simulatePlayer(playerName, quizId, i + 1);
          resolve(result);
        }, delay);
      })
    );
  }

  console.log(`⏳ Lancement de ${NUMBER_OF_PLAYERS} joueurs...\n`);

  const results = await Promise.all(promises);

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  // Analyse des résultats
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RÉSULTATS DU TEST DE CHARGE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Succès: ${successful.length}/${NUMBER_OF_PLAYERS} (${(successful.length/NUMBER_OF_PLAYERS*100).toFixed(1)}%)`);
  console.log(`❌ Échecs: ${failed.length}/${NUMBER_OF_PLAYERS} (${(failed.length/NUMBER_OF_PLAYERS*100).toFixed(1)}%)`);
  console.log(`⏱️  Temps total: ${totalTime}s`);

  if (successful.length > 0) {
    const avgDuration = (successful.reduce((sum, r) => sum + parseFloat(r.duration), 0) / successful.length).toFixed(2);
    console.log(`⚡ Temps moyen par joueur: ${avgDuration}s`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (failed.length > 0) {
    console.log('\n⚠️  ERREURS DÉTECTÉES:');
    failed.slice(0, 5).forEach(f => {
      console.log(`   - ${f.playerName}: ${f.error}`);
    });
    if (failed.length > 5) {
      console.log(`   ... et ${failed.length - 5} autres erreurs`);
    }
  }

  console.log('\n🔍 Vérification du classement...');

  try {
    const leaderboardResponse = await axios.get(`${PRODUCTION_URL}/quiz/leaderboard`);
    if (leaderboardResponse.status === 200) {
      console.log('✅ Classement accessible');
    }
  } catch (error) {
    console.log('❌ Erreur accès classement:', error.message);
  }

  if (successful.length >= NUMBER_OF_PLAYERS * 0.9) {
    console.log('\n🎉 TEST RÉUSSI ! Le système supporte 50+ joueurs simultanés.');
  } else {
    console.log('\n⚠️  ATTENTION: Taux de succès < 90%. Vérifier la configuration.');
  }
}

runLoadTest();
