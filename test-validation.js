// Direct test of the validation middleware
require('dotenv').config();

const express = require('express');
const { validateUserLogin } = require('./middlewares/validationMiddleware');

const app = express();
app.use(express.json());

// Test the validation middleware directly
console.log('🧪 Testing validation middleware...');

// Simulate different request bodies
const testCases = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'UPPERCASE@EXAMPLE.COM', password: 'password123' },
    { email: '  spaced@example.com  ', password: 'password123' },
    { email: 'invalid-email', password: 'password123' },
    { email: 'test@example.com', password: '' },
    { email: '', password: 'password123' },
    {},
    { email: 'test@example.com' },
    { password: 'password123' }
];

async function testValidation() {
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n--- Test ${i + 1} ---`);
        console.log('Input:', testCase);
        
        // Create mock request and response
        const req = { body: testCase };
        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(`❌ Validation failed (${code}):`, data);
                    return { status: code, data };
                }
            })
        };
        
        let nextCalled = false;
        const next = () => {
            nextCalled = true;
            console.log('✅ Validation passed');
        };
        
        // Test the validation middleware
        try {
            validateUserLogin(req, res, next);
            if (!nextCalled) {
                console.log('⚠️ Validation middleware did not call next() or send response');
            }
        } catch (error) {
            console.log('💥 Error in validation:', error.message);
        }
    }
}

testValidation().then(() => {
    console.log('\n🏁 Validation tests completed');
    process.exit(0);
}).catch(error => {
    console.error('💥 Test error:', error);
    process.exit(1);
});
