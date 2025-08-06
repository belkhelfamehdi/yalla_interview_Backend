const Joi = require('joi');
const { validationResult, body } = require('express-validator');

// Schémas de validation Joi
const userRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
        }),
    profileImageUrl: Joi.string().uri().optional().allow(null, '')
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
});

const sessionCreationSchema = Joi.object({
    role: Joi.string().min(2).max(100).required().trim(),
    experience: Joi.string().min(1).max(50).required().trim(),
    topicToFocus: Joi.string().min(2).max(200).required().trim(),
    description: Joi.string().max(1000).optional().allow('').trim(),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().min(5).max(1000).required().trim(),
            answer: Joi.string().min(5).max(5000).required().trim()
        })
    ).min(1).max(50).required()
});

const aiGenerationSchema = Joi.object({
    role: Joi.string().min(2).max(100).required().trim(),
    experience: Joi.string().min(1).max(50).required().trim(),
    topicToFocus: Joi.string().min(2).max(200).required().trim(),
    numberOfQuestions: Joi.number().integer().min(1).max(20).required()
});

const conceptExplanationSchema = Joi.object({
    question: Joi.string().min(5).max(1000).required().trim()
});

// Middleware de validation générique
const validateSchema = (schema) => {
    return (req, res, next) => {
        console.log('🔍 Validation input type:', typeof req.body);
        console.log('🔍 Validation input:', req.body);
        
        // Ensure req.body is an object
        if (typeof req.body !== 'object' || req.body === null) {
            console.log('❌ Invalid request body type:', typeof req.body);
            return res.status(400).json({
                success: false,
                message: 'Invalid request format',
                receivedType: typeof req.body
            });
        }
        
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true
        });
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            console.log('❌ Validation failed:', errorMessages);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMessages
            });
        }
        
        console.log('✅ Validation passed:', value);
        // Remplacer req.body par les données validées et nettoyées
        req.body = value;
        next();
    };
};

// Validateurs Express-validator pour les uploads
const validateImageUpload = [
    body('filename').optional().isString().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateUserRegistration: validateSchema(userRegistrationSchema),
    validateUserLogin: validateSchema(userLoginSchema),
    validateSessionCreation: validateSchema(sessionCreationSchema),
    validateAiGeneration: validateSchema(aiGenerationSchema),
    validateConceptExplanation: validateSchema(conceptExplanationSchema),
    validateImageUpload
};
