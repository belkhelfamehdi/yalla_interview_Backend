const express = require('express');
const { generateInterviewQuestions, generateConceptExplanation } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');
const { validateAiGeneration, validateConceptExplanation } = require('../middlewares/validationMiddleware');
const { aiLimiter } = require('../middlewares/securityMiddleware');

const router = express.Router();

// Apply AI rate limiting to all routes in this router
router.use(aiLimiter);

// Apply authentication to all routes
router.use(protect);

// AI routes
router.post('/generate-questions', validateAiGeneration, generateInterviewQuestions);
router.post('/generate-explanations', validateConceptExplanation, generateConceptExplanation);

module.exports = router;
