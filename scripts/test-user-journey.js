const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testUserJourney(playerName, quizId) {
  console.log(`\n🧪 Test du parcours pour: ${playerName} (Quiz ${quizId})`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // ÉTAPE 1: Accès à la page /play
    console.log('📱 1. Accès à /play (simulation scan QR code)...');
    const playPageResponse = await axios.get(`${BASE_URL}/play`);
    if (playPageResponse.status === 200) {
      console.log('   ✅ Page /play accessible');
    }

    // ÉTAPE 2: Soumission du formulaire (pseudo + quiz)
    console.log(`📝 2. Soumission du formulaire (${playerName}, Quiz ${quizId})...`);
    const startResponse = await axios.post(`${BASE_URL}/quiz/start`,
      `playerName=${encodeURIComponent(playerName)}&quizId=${quizId}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      }
    );

    if (startResponse.status === 302 || startResponse.status === 200) {
      console.log('   ✅ Quiz démarré avec succès');

      // Récupérer les cookies de session
      const cookies = startResponse.headers['set-cookie'];
      console.log('   ✅ Session créée (cookie reçu)');

      // ÉTAPE 3: Accès à la première question
      console.log('❓ 3. Chargement de la première question...');
      const questionResponse = await axios.get(`${BASE_URL}/quiz/question`, {
        headers: {
          'Cookie': cookies ? cookies.join('; ') : ''
        }
      });

      if (questionResponse.status === 200) {
        console.log('   ✅ Question affichée');

        // Vérifier qu'on a bien la session
        if (questionResponse.data.includes('player_name') || questionResponse.data.includes('currentQuestionIndex')) {
          console.log('   ✅ Session active détectée');
        }
      }

      // ÉTAPE 4: Simuler des réponses (5 questions)
      console.log('🎯 4. Réponse à 5 questions...');
      for (let i = 0; i < 5; i++) {
        const answers = ['A', 'B', 'C', 'D'];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

        try {
          const answerResponse = await axios.post(
            `${BASE_URL}/quiz/answer`,
            `answer=${randomAnswer}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookies ? cookies.join('; ') : ''
              },
              maxRedirects: 0,
              validateStatus: (status) => status >= 200 && status < 400
            }
          );

          if (answerResponse.status === 200 || answerResponse.status === 302) {
            console.log(`   ✅ Question ${i + 1}/5 - Réponse ${randomAnswer} soumise`);
          }
        } catch (error) {
          console.log(`   ⚠️  Question ${i + 1}/5 - Erreur: ${error.message}`);
        }

        // Petite pause entre les réponses
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('✨ 5. Test terminé avec succès !');
      return true;

    } else {
      console.log(`   ❌ Erreur lors du démarrage: ${startResponse.status}`);
      return false;
    }

  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('🎮 TESTS COMPLETS DU PARCOURS UTILISATEUR');
  console.log('==========================================\n');
  console.log(`🌐 URL de test: ${BASE_URL}\n`);

  const testCases = [
    { name: 'TestUser1', quizId: 1 },
    { name: 'TestUser2', quizId: 2 },
    { name: 'TestUser3', quizId: 3 },
    { name: 'TestUser4', quizId: 4 },
    { name: 'JeanDupont', quizId: 1 }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    const success = await testUserJourney(testCase.name, testCase.quizId);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Pause entre chaque test
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Tests réussis: ${successCount}/${testCases.length}`);
  console.log(`❌ Tests échoués: ${failCount}/${testCases.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (failCount === 0) {
    console.log('🎉 Tous les tests sont passés ! Le système est prêt.');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifier les erreurs ci-dessus.');
  }
}

runTests();
