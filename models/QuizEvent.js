const db = require('../config/database');

class QuizEvent {
  // Créer un nouvel événement de quiz
  static async create(name, quizId) {
    await db.connect();
    const result = await db.run(
      `INSERT INTO quiz_events (name, quiz_id, status)
       VALUES (?, ?, 'waiting')`,
      [name, quizId]
    );
    return result.lastID;
  }

  // Obtenir l'événement actif (en attente ou démarré)
  static async getActive() {
    await db.connect();
    const event = await db.get(
      `SELECT * FROM quiz_events
       WHERE status IN ('waiting', 'started')
       ORDER BY created_at DESC
       LIMIT 1`
    );
    return event;
  }

  // Obtenir un événement par ID
  static async getById(eventId) {
    await db.connect();
    const event = await db.get(
      'SELECT * FROM quiz_events WHERE id = ?',
      [eventId]
    );
    return event;
  }

  // Lancer l'événement (passer de 'waiting' à 'started')
  static async start(eventId) {
    await db.connect();
    await db.run(
      `UPDATE quiz_events
       SET status = 'started', started_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [eventId]
    );
  }

  // Terminer l'événement
  static async finish(eventId) {
    await db.connect();
    await db.run(
      `UPDATE quiz_events
       SET status = 'finished', finished_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [eventId]
    );
  }

  // Obtenir tous les événements
  static async getAll() {
    await db.connect();
    const events = await db.all(
      `SELECT * FROM quiz_events
       ORDER BY created_at DESC`
    );
    return events;
  }

  // Obtenir les participants en attente pour un événement
  static async getWaitingParticipants(eventId) {
    await db.connect();
    const participants = await db.all(
      `SELECT * FROM event_participants
       WHERE event_id = ?
       ORDER BY joined_at ASC`,
      [eventId]
    );
    return participants;
  }

  // Ajouter un participant à l'événement
  static async addParticipant(eventId, playerName) {
    await db.connect();
    await db.run(
      `INSERT INTO event_participants (event_id, player_name)
       VALUES (?, ?)`,
      [eventId, playerName]
    );
  }

  // Vérifier si un participant est déjà inscrit
  static async isParticipantRegistered(eventId, playerName) {
    await db.connect();
    const participant = await db.get(
      `SELECT * FROM event_participants
       WHERE event_id = ? AND player_name = ?`,
      [eventId, playerName]
    );
    return !!participant;
  }

  // Compter les participants en attente
  static async countParticipants(eventId) {
    await db.connect();
    const result = await db.get(
      `SELECT COUNT(*) as count FROM event_participants
       WHERE event_id = ?`,
      [eventId]
    );
    return result.count || 0;
  }
}

module.exports = QuizEvent;
