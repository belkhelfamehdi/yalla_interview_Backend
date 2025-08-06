const express = require('express');
const { createSession, getSessionById, getMySessions, deleteSession } = require('../controllers/sessionController');
const { protect } = require('../middlewares/authMiddleware');
const { validateSessionCreation } = require('../middlewares/validationMiddleware');
const { generalLimiter } = require('../middlewares/securityMiddleware');

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Apply authentication to all routes
router.use(protect);

// Session routes with validation
router.post('/create', validateSessionCreation, createSession);
router.get('/my-sessions', getMySessions);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);

module.exports = router;
