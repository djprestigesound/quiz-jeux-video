const QuizEvent = require('../models/QuizEvent');

// Vérifier le statut de l'événement actif (API pour le polling)
exports.checkEventStatus = async (req, res) => {
  try {
    const event = await QuizEvent.getActive();

    if (!event) {
      return res.json({ status: 'no_event' });
    }

    const participantCount = await QuizEvent.countParticipants(event.id);

    res.json({
      status: event.status,
      eventId: event.id,
      eventName: event.name,
      quizId: event.quiz_id,
      participantCount
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Inscription à un événement
exports.joinEvent = async (req, res) => {
  try {
    const { playerName } = req.body;

    if (!playerName || playerName.trim() === '') {
      return res.status(400).json({ error: 'Le nom du joueur est requis' });
    }

    const event = await QuizEvent.getActive();

    if (!event) {
      return res.status(404).json({ error: 'Aucun événement actif' });
    }

    if (event.status !== 'waiting') {
      return res.status(400).json({ error: 'L\'événement a déjà commencé' });
    }

    // Vérifier si déjà inscrit
    const isRegistered = await QuizEvent.isParticipantRegistered(event.id, playerName);
    if (isRegistered) {
      return res.json({
        success: true,
        eventId: event.id,
        message: 'Déjà inscrit'
      });
    }

    // Inscrire le participant
    await QuizEvent.addParticipant(event.id, playerName);

    res.json({
      success: true,
      eventId: event.id,
      message: 'Inscription réussie'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};
