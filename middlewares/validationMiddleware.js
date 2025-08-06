const { z } = require('zod');
const { validationResult, body } = require('express-validator');

// Schémas de validation Zod
const userRegistrationSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .trim(),
    email: z.string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
        ),
    profileImageUrl: z.union([
        z.string().url(),
        z.string().length(0),
        z.null(),
        z.undefined()
    ]).optional()
});

const userLoginSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(1, 'Password is required')
});

const sessionCreationSchema = z.object({
    role: z.string()
        .min(2, 'Role must be at least 2 characters')
        .max(100, 'Role must be less than 100 characters')
        .trim(),
    experience: z.string()
        .min(1, 'Experience is required')
        .max(50, 'Experience must be less than 50 characters')
        .trim(),
    topicToFocus: z.string()
        .min(2, 'Topic must be at least 2 characters')
        .max(200, 'Topic must be less than 200 characters')
        .trim(),
    description: z.string()
        .max(1000, 'Description must be less than 1000 characters')
        .trim()
        .optional()
        .or(z.literal('')),
    questions: z.array(
        z.object({
            question: z.string()
                .min(5, 'Question must be at least 5 characters')
                .max(1000, 'Question must be less than 1000 characters')
                .trim(),
            answer: z.string()
                .min(5, 'Answer must be at least 5 characters')
                .max(5000, 'Answer must be less than 5000 characters')
                .trim()
        })
    )
    .min(1, 'At least one question is required')
    .max(50, 'Maximum 50 questions allowed')
});

const aiGenerationSchema = z.object({
    role: z.string()
        .min(2, 'Role must be at least 2 characters')
        .max(100, 'Role must be less than 100 characters')
        .trim(),
    experience: z.string()
        .min(1, 'Experience is required')
        .max(50, 'Experience must be less than 50 characters')
        .trim(),
    topicToFocus: z.string()
        .min(2, 'Topic must be at least 2 characters')
        .max(200, 'Topic must be less than 200 characters')
        .trim(),
    numberOfQuestions: z.number()
        .int('Number of questions must be an integer')
        .min(1, 'At least 1 question required')
        .max(20, 'Maximum 20 questions allowed')
});

const conceptExplanationSchema = z.object({
    question: z.string()
        .min(5, 'Question must be at least 5 characters')
        .max(1000, 'Question must be less than 1000 characters')
        .trim()
});

// Middleware de validation générique
const validateSchema = (schema) => {
    return (req, res, next) => {
        // Ensure req.body is an object
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request format'
            });
        }
        
        try {
            // Parse and validate with Zod
            const validatedData = schema.parse(req.body);
            
            // Replace req.body with validated and cleaned data
            req.body = validatedData;
            next();
        } catch (error) {
            // Handle Zod validation errors
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => 
                    `${err.path.join('.')}: ${err.message}`
                );
                
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errorMessages
                });
            }
            
            // Handle other errors
            return res.status(400).json({
                success: false,
                message: 'Validation failed'
            });
        }
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
