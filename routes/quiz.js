const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Redirection si accès direct à /quiz/start
router.get('/start', (req, res) => {
  res.redirect('/');
});

router.post('/start', quizController.start);
router.get('/question', quizController.showQuestion);
router.post('/answer', quizController.submitAnswer);
router.get('/results', quizController.showResults);
// Route spécifique AVANT la route générale
router.get('/leaderboard/display', quizController.leaderboardDisplay);
router.get('/leaderboard', quizController.leaderboard);

module.exports = router;
