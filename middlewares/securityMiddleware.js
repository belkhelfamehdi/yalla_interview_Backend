const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later.',
                retryAfter: Math.ceil(windowMs / 1000 / 60), // minutes
                type: 'RATE_LIMIT_EXCEEDED'
            });
        }
    });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    process.env.NODE_ENV === 'production' ? 200 : 1000, // Higher limit in dev
    'Too many requests from this IP, please try again later.'
);

const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes  
    process.env.NODE_ENV === 'production' ? 25 : 100, // Higher limit in dev
    'Too many authentication attempts, please try again later.'
);

const aiLimiter = createRateLimit(
    60 * 60 * 1000, // 1 hour
    20, // limit each IP to 20 AI requests per hour
    'Too many AI generation requests, please try again later.'
);

const uploadLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // limit each IP to 10 uploads per 15 minutes
    'Too many upload attempts, please try again later.'
);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(isDevelopment && { stack: err.stack })
    });
};

module.exports = {
    generalLimiter,
    authLimiter,
    aiLimiter,
    uploadLimiter,
    errorHandler
};
