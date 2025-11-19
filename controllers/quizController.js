const Question = require('../models/Question');
const QuizSession = require('../models/QuizSession');
const config = require('../config/config');

exports.start = async (req, res) => {
  try {
    const { playerName, quizId, eventId } = req.body;
    const selectedQuizId = parseInt(quizId) || 1;
    const sessionId = await QuizSession.create(playerName || 'Joueur', selectedQuizId, eventId || null);

    // Récupérer des questions aléatoires pour le quiz sélectionné
    const questions = await Question.getRandom(config.quiz.questionsPerSession, selectedQuizId);

    // Stocker UNIQUEMENT les IDs des questions (pas les questions complètes - limite cookie 4KB)
    const questionIds = questions.map(q => q.id);

    req.session.sessionId = sessionId;
    req.session.quizId = selectedQuizId;
    req.session.questionIds = questionIds;
    req.session.currentQuestionIndex = 0;
    req.session.score = 0;
    req.session.correctAnswers = 0;

    res.redirect('/quiz/question');
  } catch (error) {
    console.error('Erreur lors du démarrage du quiz:', error);
    res.status(500).send('Erreur lors du démarrage du quiz');
  }
};

exports.showQuestion = async (req, res) => {
  try {
    const { questionIds, currentQuestionIndex, score, correctAnswers } = req.session;

    if (!questionIds || currentQuestionIndex >= questionIds.length) {
      return res.redirect('/quiz/results');
    }

    // Récupérer la question depuis la DB
    const currentQuestionId = questionIds[currentQuestionIndex];
    const currentQuestion = await Question.getById(currentQuestionId);

    const totalQuestions = questionIds.length;
    const questionNumber = currentQuestionIndex + 1;

    res.render('quiz/question', {
      question: currentQuestion,
      questionNumber,
      totalQuestions,
      score: score || 0,
      correctAnswers: correctAnswers || 0,
      timePerQuestion: config.quiz.timePerQuestion
    });
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la question:', error);
    res.status(500).send('Erreur lors de l\'affichage de la question');
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const { questionIds, currentQuestionIndex, sessionId, score, correctAnswers } = req.session;

    if (!questionIds || currentQuestionIndex >= questionIds.length) {
      return res.json({ error: 'Session invalide' });
    }

    // Récupérer la question depuis la DB
    const currentQuestionId = questionIds[currentQuestionIndex];
    const currentQuestion = await Question.getById(currentQuestionId);

    const isCorrect = answer === currentQuestion.correct_answer;

    // Sauvegarder la réponse
    await QuizSession.saveAnswer(sessionId, currentQuestion.id, answer, isCorrect);

    // Mettre à jour le score (cookie-session nécessite de ré-assigner)
    let newScore = score || 0;
    let newCorrectAnswers = correctAnswers || 0;

    if (isCorrect) {
      newCorrectAnswers = newCorrectAnswers + 1;
      newScore = newScore + config.quiz.pointsPerCorrectAnswer;
    }

    req.session.correctAnswers = newCorrectAnswers;
    req.session.score = newScore;

    // Passer à la question suivante
    const newQuestionIndex = currentQuestionIndex + 1;
    req.session.currentQuestionIndex = newQuestionIndex;

    res.json({
      correct: isCorrect,
      correctAnswer: currentQuestion.correct_answer,
      score: newScore,
      nextQuestion: newQuestionIndex < questionIds.length
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la réponse:', error);
    res.status(500).json({ error: 'Erreur lors de la soumission' });
  }
};

exports.showResults = async (req, res) => {
  try {
    const { sessionId, score, correctAnswers, questionIds } = req.session;

    if (!sessionId) {
      return res.redirect('/');
    }

    const totalQuestions = questionIds ? questionIds.length : 0;

    // Mettre à jour le score final
    await QuizSession.updateScore(sessionId, score, correctAnswers, totalQuestions);
    await QuizSession.complete(sessionId);

    // Récupérer les détails de la session
    const session = await QuizSession.getById(sessionId);
    const leaderboard = await QuizSession.getLeaderboard(10);

    // Calculer la position dans le classement
    const position = leaderboard.findIndex(entry => entry.score <= score) + 1;

    // Générer QR code pour DJ Prestige Sound
    const QRCode = require('qrcode');
    const djWebsiteUrl = 'https://djprestigesound.be';
    const djQRCode = await QRCode.toDataURL(djWebsiteUrl, {
      errorCorrectionLevel: 'H',
      width: 250,
      color: {
        dark: '#FF006E',  // Rose néon pour DJ Prestige Sound
        light: '#0A0E27'
      }
    });

    res.render('quiz/results', {
      session,
      score,
      correctAnswers,
      totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      leaderboard,
      position: position || leaderboard.length + 1,
      djQRCode,
      djWebsiteUrl
    });

    // Nettoyer la session
    req.session.destroy();
  } catch (error) {
    console.error('Erreur lors de l\'affichage des résultats:', error);
    res.status(500).send('Erreur lors de l\'affichage des résultats');
  }
};

exports.leaderboard = async (req, res) => {
  try {
    const leaderboard = await QuizSession.getLeaderboard(20);
    res.render('quiz/leaderboard', { leaderboard });
  } catch (error) {
    console.error('Erreur lors de l\'affichage du classement:', error);
    res.status(500).send('Erreur lors de l\'affichage du classement');
  }
};

// Mode écran géant pour projeter le classement
exports.leaderboardDisplay = async (req, res) => {
  try {
    const leaderboard = await QuizSession.getLeaderboard(10); // Top 10 pour l'écran
    const activePlayers = await QuizSession.getActiveSessions(); // Joueurs en cours
    res.render('quiz/leaderboard-display', { leaderboard, activePlayers });
  } catch (error) {
    console.error('Erreur lors de l\'affichage du classement géant:', error);
    res.status(500).send('Erreur lors de l\'affichage du classement');
  }
};
