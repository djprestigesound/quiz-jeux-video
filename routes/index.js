const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const QuizEvent = require('../models/QuizEvent');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/play', async (req, res) => {
  try {
    const activeEvent = await QuizEvent.getActive();
    res.render('play', { activeEvent });
  } catch (error) {
    console.error('Erreur lors du chargement de /play:', error);
    res.render('play', { activeEvent: null });
  }
});

router.get('/qrcode', qrController.showQRCode);

module.exports = router;
