const Question = require('../models/Question');
const QuizSession = require('../models/QuizSession');
const config = require('../config/config');

exports.start = async (req, res) => {
  try {
    const { playerName } = req.body;
    const sessionId = await QuizSession.create(playerName || 'Joueur');

    // Récupérer des questions aléatoires
    const questions = await Question.getRandom(config.quiz.questionsPerSession);

    // Stocker les questions dans la session
    req.session.sessionId = sessionId;
    req.session.questions = questions;
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
    const { questions, currentQuestionIndex, score, correctAnswers } = req.session;

    if (!questions || currentQuestionIndex >= questions.length) {
      return res.redirect('/quiz/results');
    }

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const questionNumber = currentQuestionIndex + 1;

    res.render('quiz/question', {
      question: currentQuestion,
      questionNumber,
      totalQuestions,
      score,
      correctAnswers,
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
    const { questions, currentQuestionIndex, sessionId, score, correctAnswers } = req.session;

    if (!questions || currentQuestionIndex >= questions.length) {
      return res.json({ error: 'Session invalide' });
    }

    const currentQuestion = questions[currentQuestionIndex];
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
      nextQuestion: newQuestionIndex < questions.length
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la réponse:', error);
    res.status(500).json({ error: 'Erreur lors de la soumission' });
  }
};

exports.showResults = async (req, res) => {
  try {
    const { sessionId, score, correctAnswers, questions } = req.session;

    if (!sessionId) {
      return res.redirect('/');
    }

    const totalQuestions = questions ? questions.length : 0;

    // Mettre à jour le score final
    await QuizSession.updateScore(sessionId, score, correctAnswers, totalQuestions);
    await QuizSession.complete(sessionId);

    // Récupérer les détails de la session
    const session = await QuizSession.getById(sessionId);
    const leaderboard = await QuizSession.getLeaderboard(10);

    // Calculer la position dans le classement
    const position = leaderboard.findIndex(entry => entry.score <= score) + 1;

    res.render('quiz/results', {
      session,
      score,
      correctAnswers,
      totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      leaderboard,
      position: position || leaderboard.length + 1
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
