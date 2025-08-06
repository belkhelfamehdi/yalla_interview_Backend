// Simple test for login validation issue
const axios = require('axios');

const PROD_BASE_URL = 'https://yalla-interview-backend.onrender.com';

async function testLoginValidation() {
    console.log('🔍 Testing Login Validation Issue...\n');
    
    // Test the actual login endpoint with different scenarios
    const testCases = [
        {
            name: 'Valid login data',
            data: { email: 'test@example.com', password: 'password123' }
        },
        {
            name: 'Empty fields (common issue)',
            data: { email: '', password: '' }
        },
        {
            name: 'Missing fields',
            data: {}
        },
        {
            name: 'Only email',
            data: { email: 'test@example.com' }
        },
        {
            name: 'Only password',
            data: { password: 'password123' }
        },
        {
            name: 'Invalid email format',
            data: { email: 'invalid-email', password: 'password123' }
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n--- ${testCase.name} ---`);
        console.log('Sending:', testCase.data);
        
        try {
            const response = await axios.post(`${PROD_BASE_URL}/api/auth/login`, testCase.data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            if (error.response) {
                console.log('❌ Validation Error:', error.response.data);
                console.log('Status:', error.response.status);
            } else {
                console.log('💥 Network Error:', error.message);
            }
        }
    }
}

testLoginValidation().then(() => {
    console.log('\n🏁 Login validation tests completed');
    process.exit(0);
}).catch(error => {
    console.error('💥 Test error:', error.message);
    process.exit(1);
});
