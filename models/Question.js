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
    // Trier par difficulté pour progression : easy → medium → hard
    const questions = await db.all(
      `SELECT * FROM questions
       WHERE quiz_id = ?
       ORDER BY
         CASE difficulty
           WHEN 'easy' THEN 1
           WHEN 'medium' THEN 2
           WHEN 'hard' THEN 3
           ELSE 2
         END,
         RANDOM()
       LIMIT ?`,
      [quizId, limit]
    );
    return questions;
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
