const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes publiques
router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Routes protégées
router.use(adminController.checkAuth);

router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', adminController.dashboard);

router.get('/questions', adminController.listQuestions);
router.get('/questions/add', adminController.showAddQuestion);
router.post('/questions/add', adminController.addQuestion);
router.get('/questions/edit/:id', adminController.showEditQuestion);
router.post('/questions/edit/:id', adminController.updateQuestion);
router.post('/questions/delete/:id', adminController.deleteQuestion);

router.get('/qrcodes', adminController.showQRCodes);
router.get('/sessions', adminController.showSessions);

// Gestion des événements
router.get('/events', adminController.showEvents);
router.post('/events/create', adminController.createEvent);
router.post('/events/:eventId/start', adminController.startEvent);
router.post('/events/:eventId/finish', adminController.finishEvent);

module.exports = router;
