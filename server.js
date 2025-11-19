require('dotenv').config();

const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config');

const app = express();

// Configuration du moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de session (cookie-based pour serverless)
app.use(cookieSession({
  name: 'quiz-session',
  keys: [config.sessionSecret, 'quiz-jeux-video-backup-key'],
  maxAge: 24 * 60 * 60 * 1000 // 24 heures
}));

// Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');
const eventRoutes = require('./routes/events');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/quiz', quizRoutes);
app.use('/events', eventRoutes);

// Démarrage du serveur (local uniquement)
if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`\n🎮 Serveur de quiz jeux vidéo démarré !`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`👨‍💼 Admin: http://localhost:${PORT}/admin`);
    console.log(`\n✨ Prêt à jouer !\n`);
  });
}

// Export pour Vercel (serverless)
module.exports = app;
