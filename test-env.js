require('dotenv').config();
const express = require('express');

console.log('🔧 Testing environment variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

// Test basic server functionality
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working',
        env: {
            NODE_ENV: process.env.NODE_ENV,
            HAS_JWT_SECRET: !!process.env.JWT_SECRET,
            HAS_MONGODB_URI: !!process.env.MONGODB_URI
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log('Environment loaded successfully');
    process.exit(0);
});
