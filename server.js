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

// Connect to database
connectDB();

// Security headers
app.use(securityHeaders);

// CORS configuration - SECURE
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://yalla-interview.mehdibelkhelfa.com',
        'https://www.yalla-interview.mehdibelkhelfa.com'
      ]
    : [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001"
      ];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
}));// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Debug endpoint for CORS testing
app.get("/api/cors-test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CORS is working",
        origin: req.headers.origin,
        allowedOrigins: process.env.NODE_ENV === 'production' 
            ? [process.env.FRONTEND_URL, 'https://yalla-interview.mehdibelkhelfa.com']
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
        environment: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
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