const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/start', quizController.start);
router.get('/question', quizController.showQuestion);
router.post('/answer', quizController.submitAnswer);
router.get('/results', quizController.showResults);
router.get('/leaderboard', quizController.leaderboard);

module.exports = router;
