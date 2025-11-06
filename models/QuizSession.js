const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class QuizSession {
  static async create(playerName = 'Joueur') {
    await db.connect();
    const sessionId = uuidv4();

    await db.run(
      `INSERT INTO quiz_sessions (id, player_name, score, total_questions, correct_answers)
       VALUES (?, ?, 0, 0, 0)`,
      [sessionId, playerName]
    );

    return sessionId;
  }

  static async getById(sessionId) {
    await db.connect();
    const session = await db.get(
      'SELECT * FROM quiz_sessions WHERE id = ?',
      [sessionId]
    );
    return session;
  }

  static async updateScore(sessionId, score, correctAnswers, totalQuestions) {
    await db.connect();
    await db.run(
      `UPDATE quiz_sessions
       SET score = ?, correct_answers = ?, total_questions = ?
       WHERE id = ?`,
      [score, correctAnswers, totalQuestions, sessionId]
    );
  }

  static async complete(sessionId) {
    await db.connect();
    await db.run(
      `UPDATE quiz_sessions
       SET completed_at = NOW()
       WHERE id = ?`,
      [sessionId]
    );
  }

  static async saveAnswer(sessionId, questionId, userAnswer, isCorrect) {
    await db.connect();
    await db.run(
      `INSERT INTO answers (session_id, question_id, user_answer, is_correct)
       VALUES (?, ?, ?, ?)`,
      [sessionId, questionId, userAnswer, isCorrect]
    );
  }

  static async getAnswers(sessionId) {
    await db.connect();
    const answers = await db.all(
      `SELECT a.*, q.question, q.correct_answer
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.session_id = ?
       ORDER BY a.answered_at`,
      [sessionId]
    );
    return answers;
  }

  static async getAllSessions() {
    await db.connect();
    const sessions = await db.all(
      `SELECT * FROM quiz_sessions
       ORDER BY started_at DESC`
    );
    return sessions;
  }

  static async getLeaderboard(limit = 10) {
    await db.connect();
    const leaderboard = await db.all(
      `SELECT player_name, score, correct_answers, total_questions, completed_at
       FROM quiz_sessions
       WHERE completed_at IS NOT NULL
       ORDER BY score DESC, completed_at ASC
       LIMIT ?`,
      [limit]
    );
    return leaderboard;
  }

  static async getStats() {
    await db.connect();
    const stats = await db.get(
      `SELECT
         COUNT(*) as total_sessions,
         COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed_sessions,
         AVG(score) as avg_score,
         MAX(score) as max_score
       FROM quiz_sessions`
    );
    return stats;
  }
}

module.exports = QuizSession;
