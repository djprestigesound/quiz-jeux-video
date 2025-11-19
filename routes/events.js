const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// API pour vérifier le statut de l'événement (polling)
router.get('/status', eventController.checkEventStatus);

// Inscription à un événement
router.post('/join', eventController.joinEvent);

module.exports = router;
