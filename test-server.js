const express = require('express');
const cors = require('cors');
const { validateUserLogin } = require('./middlewares/validationMiddleware');

// Quick test server to isolate the login endpoint
const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Test endpoint without validation
app.post('/test-login-no-validation', (req, res) => {
    console.log('📝 Raw request body:', req.body);
    console.log('📝 Content-Type:', req.headers['content-type']);
    
    res.json({
        success: true,
        message: 'Test endpoint without validation',
        received: req.body,
        headers: {
            'content-type': req.headers['content-type'],
            'origin': req.headers['origin']
        }
    });
});

// Test endpoint with validation
app.post('/test-login-with-validation', validateUserLogin, (req, res) => {
    console.log('✅ Validation passed, body:', req.body);
    
    res.json({
        success: true,
        message: 'Validation passed successfully',
        validated: req.body
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Test server is running' });
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`🧪 Test server running on port ${PORT}`);
    console.log('Test endpoints:');
    console.log(`- GET  http://localhost:${PORT}/health`);
    console.log(`- POST http://localhost:${PORT}/test-login-no-validation`);
    console.log(`- POST http://localhost:${PORT}/test-login-with-validation`);
});

module.exports = app;
