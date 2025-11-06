const Question = require('../models/Question');
const QuizSession = require('../models/QuizSession');
const QRCode = require('qrcode');
const config = require('../config/config');

// Middleware d'authentification simple
exports.checkAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
};

exports.showLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

exports.login = (req, res) => {
  const { password } = req.body;

  if (password === config.admin.password) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Mot de passe incorrect' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

exports.dashboard = async (req, res) => {
  try {
    const stats = await QuizSession.getStats();
    const questionCount = await Question.count();
    const categories = await Question.getCategories();
    const recentSessions = await QuizSession.getAllSessions();

    res.render('admin/dashboard', {
      stats,
      questionCount,
      categories,
      recentSessions: recentSessions.slice(0, 10)
    });
  } catch (error) {
    console.error('Erreur lors de l\'affichage du dashboard:', error);
    res.status(500).send('Erreur lors de l\'affichage du dashboard');
  }
};

exports.listQuestions = async (req, res) => {
  try {
    const questions = await Question.getAll();
    const categories = await Question.getCategories();

    res.render('admin/questions', {
      questions,
      categories
    });
  } catch (error) {
    console.error('Erreur lors de l\'affichage des questions:', error);
    res.status(500).send('Erreur lors de l\'affichage des questions');
  }
};

exports.showAddQuestion = async (req, res) => {
  try {
    const categories = await Question.getCategories();
    res.render('admin/add-question', { categories, error: null });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur');
  }
};

exports.addQuestion = async (req, res) => {
  try {
    await Question.create(req.body);
    res.redirect('/admin/questions');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la question:', error);
    const categories = await Question.getCategories();
    res.render('admin/add-question', {
      categories,
      error: 'Erreur lors de l\'ajout de la question'
    });
  }
};

exports.showEditQuestion = async (req, res) => {
  try {
    const question = await Question.getById(req.params.id);
    const categories = await Question.getCategories();

    if (!question) {
      return res.redirect('/admin/questions');
    }

    res.render('admin/edit-question', {
      question,
      categories,
      error: null
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur');
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    await Question.update(req.params.id, req.body);
    res.redirect('/admin/questions');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.redirect('/admin/questions');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.delete(req.params.id);
    res.redirect('/admin/questions');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.redirect('/admin/questions');
  }
};

exports.showQRCodes = async (req, res) => {
  try {
    // Détecter l'URL : production ou local
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${config.port}`;
    const qrCodeUrl = await QRCode.toDataURL(baseUrl);

    res.render('admin/qrcodes', {
      qrCodeUrl,
      baseUrl
    });
  } catch (error) {
    console.error('Erreur lors de la génération des QR codes:', error);
    res.status(500).send('Erreur lors de la génération des QR codes');
  }
};

exports.showSessions = async (req, res) => {
  try {
    const sessions = await QuizSession.getAllSessions();
    res.render('admin/sessions', { sessions });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur');
  }
};
