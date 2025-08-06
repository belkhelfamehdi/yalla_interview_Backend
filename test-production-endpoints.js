// Quick diagnostic script to test production endpoints
const axios = require('axios');

const PROD_BASE_URL = 'https://yalla-interview-backend.onrender.com'; // Replace with your actual production URL

async function testProductionEndpoints() {
    console.log('🔍 Testing Production Endpoints...\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${PROD_BASE_URL}/api/health`);
        console.log('✅ Health check passed:', healthResponse.data);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }
    
    try {
        // Test 2: CORS test
        console.log('\n2. Testing CORS endpoint...');
        const corsResponse = await axios.get(`${PROD_BASE_URL}/api/cors-test`);
        console.log('✅ CORS test passed:', corsResponse.data);
    } catch (error) {
        console.log('❌ CORS test failed:', error.message);
    }
    
    try {
        // Test 3: Debug login with valid data
        console.log('\n3. Testing debug login endpoint...');
        const debugResponse = await axios.post(`${PROD_BASE_URL}/api/debug-login`, {
            email: 'test@example.com',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Debug login passed:', debugResponse.data);
    } catch (error) {
        console.log('❌ Debug login failed:', error.response?.data || error.message);
    }
    
    try {
        // Test 4: Create test user
        console.log('\n4. Creating test user...');
        const createUserResponse = await axios.post(`${PROD_BASE_URL}/api/create-test-user`);
        console.log('✅ Test user created:', createUserResponse.data);
    } catch (error) {
        console.log('❌ Test user creation failed:', error.response?.data || error.message);
    }
    
    try {
        // Test 5: Login with debug endpoint (no validation)
        console.log('\n5. Testing login-debug endpoint...');
        const loginDebugResponse = await axios.post(`${PROD_BASE_URL}/api/auth/login-debug`, {
            email: 'test@yalla.com',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login debug passed:', loginDebugResponse.data);
    } catch (error) {
        console.log('❌ Login debug failed:', error.response?.data || error.message);
    }
    
    try {
        // Test 6: Actual login endpoint (with validation)
        console.log('\n6. Testing actual login endpoint...');
        const loginResponse = await axios.post(`${PROD_BASE_URL}/api/auth/login`, {
            email: 'test@yalla.com',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Actual login passed:', loginResponse.data);
    } catch (error) {
        console.log('❌ Actual login failed:', error.response?.data || error.message);
    }
    
    // Test various validation failure scenarios
    console.log('\n7. Testing validation failure scenarios...');
    
    const testCases = [
        { name: 'Empty email and password', data: { email: '', password: '' } },
        { name: 'Missing email', data: { password: 'password123' } },
        { name: 'Missing password', data: { email: 'test@example.com' } },
        { name: 'Invalid email format', data: { email: 'invalid-email', password: 'password123' } },
        { name: 'Null values', data: { email: null, password: null } }
    ];
    
    for (const testCase of testCases) {
        try {
            console.log(`\n  Testing: ${testCase.name}`);
            const response = await axios.post(`${PROD_BASE_URL}/api/auth/login`, testCase.data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`  ✅ Unexpected success:`, response.data);
        } catch (error) {
            console.log(`  ❌ Expected validation error:`, error.response?.data || error.message);
        }
    }
}

// Only run if called directly (not imported)
if (require.main === module) {
    testProductionEndpoints().then(() => {
        console.log('\n🏁 Production endpoint tests completed');
        process.exit(0);
    }).catch(error => {
        console.error('💥 Test error:', error.message);
        process.exit(1);
    });
}

module.exports = { testProductionEndpoints };
