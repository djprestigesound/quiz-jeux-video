const db = require('../config/database');

class Question {
  static async getAll() {
    await db.connect();
    const questions = await db.all('SELECT * FROM questions ORDER BY id');
    return questions;
  }

  static async getById(id) {
    await db.connect();
    const question = await db.get('SELECT * FROM questions WHERE id = ?', [id]);
    return question;
  }

  static async getRandom(limit = 10, quizId = 1) {
    await db.connect();
    // Récupérer toutes les questions du quiz
    const allQuestions = await db.all(
      `SELECT * FROM questions WHERE quiz_id = ?`,
      [quizId]
    );

    // Mélanger les questions (algorithme Fisher-Yates)
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Trier par difficulté pour avoir une progression
    shuffled.sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      const diffA = difficultyOrder[a.difficulty] || 2;
      const diffB = difficultyOrder[b.difficulty] || 2;
      return diffA - diffB;
    });

    // Prendre les N premières questions (garantit unicité)
    const selectedQuestions = shuffled.slice(0, Math.min(limit, shuffled.length));

    // Vérification de sécurité : s'assurer qu'il n'y a pas de doublons par ID
    const uniqueQuestions = selectedQuestions.filter((q, index, self) =>
      index === self.findIndex(t => t.id === q.id)
    );

    return uniqueQuestions;
  }

  static async getByCategory(category) {
    await db.connect();
    const questions = await db.all(
      'SELECT * FROM questions WHERE category = ?',
      [category]
    );
    return questions;
  }

  static async create(questionData) {
    await db.connect();
    const { question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty } = questionData;

    const result = await db.run(
      `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty || 'medium']
    );

    return result.lastID;
  }

  static async update(id, questionData) {
    await db.connect();
    const { question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty } = questionData;

    await db.run(
      `UPDATE questions
       SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?,
           correct_answer = ?, category = ?, difficulty = ?
       WHERE id = ?`,
      [question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, id]
    );
  }

  static async delete(id) {
    await db.connect();
    await db.run('DELETE FROM questions WHERE id = ?', [id]);
  }

  static async count() {
    await db.connect();
    const result = await db.get('SELECT COUNT(*) as count FROM questions');
    return result.count;
  }

  static async getCategories() {
    await db.connect();
    const categories = await db.all(
      'SELECT DISTINCT category, COUNT(*) as count FROM questions GROUP BY category'
    );
    return categories;
  }
}

module.exports = Question;
