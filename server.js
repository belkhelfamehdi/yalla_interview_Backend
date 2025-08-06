require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Import security middlewares
const {
    generalLimiter,
    securityHeaders,
    xssProtection,
    noSqlInjectionProtection,
    errorHandler
} = require("./middlewares/securityMiddleware");

const app = express();

// Trust proxy for accurate IP detection behind Render's proxy
app.set('trust proxy', 1);

// Connect to database
connectDB();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} from ${req.headers.origin || 'no-origin'}`);
    console.log(`📋 Content-Type: ${req.headers['content-type']}`);
    console.log(`📊 Body type: ${typeof req.body}`);
    if (req.body && typeof req.body === 'object') {
        console.log(`📦 Body keys: ${Object.keys(req.body)}`);
    }
    next();
});

// Security headers
app.use(securityHeaders);

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        'https://yalla-interview.mehdibelkhelfa.com',
    ].filter(Boolean) // Remove undefined values
    : [
        "http://localhost:3000",
    ];

app.use(cors({
    origin: function (origin, callback) {
        console.log('🌐 CORS request from origin:', origin);

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            console.log('✅ Allowing request with no origin');
            return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            console.log('📋 Allowed origins:', allowedOrigins);

            // Temporary: Allow all origins if we can't determine the correct one
            if (process.env.NODE_ENV !== 'production' || allowedOrigins.length === 0) {
                console.log('⚠️ Fallback: Allowing origin due to configuration issue');
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
}));

// Body parsing middleware (must come before routes and validation)
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf, encoding) => {
        // Store raw body for debugging if needed
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add JSON parsing error handling
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.log('❌ JSON parsing error:', error.message);
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format',
            error: 'Request body contains malformed JSON'
        });
    }
    next(error);
});

// Security middlewares
app.use(xssProtection);
app.use(noSqlInjectionProtection);

// General rate limiting
app.use(generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Serve uploaded files securely
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    maxAge: '1d',
    etag: false,
    setHeaders: (res, path) => {
        // Security headers for static files
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'DENY');
    }
}));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔒 Security measures activated`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});