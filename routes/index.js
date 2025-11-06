const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/play', (req, res) => {
  res.render('play');
});

router.get('/qrcode', qrController.showQRCode);

module.exports = router;
