module.exports = {
  port: process.env.PORT || 3001,
  sessionSecret: 'quiz-jeux-video-secret-key-2024',
  dbPath: './database/quiz.db',

  // Configuration du quiz
  quiz: {
    questionsPerSession: 10, // Nombre de questions par session
    timePerQuestion: 30, // Secondes par question (0 = pas de limite)
    pointsPerCorrectAnswer: 100,
    showCorrectAnswerAfterResponse: true
  },

  // Configuration admin
  admin: {
    password: 'admin123' // À changer en production !
  }
};
