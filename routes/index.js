const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const QuizEvent = require('../models/QuizEvent');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/play', async (req, res) => {
  // Mode libre : pas de salle d'attente, les participants choisissent leur quiz
  res.render('play', { activeEvent: null });
});

router.get('/qrcode', qrController.showQRCode);

module.exports = router;
