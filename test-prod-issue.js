const Joi = require('joi');

// Test the exact same validation that happens in production
const userLoginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
});

// Test what happens with common production issues
const prodTestCases = [
    // Normal case
    { email: 'user@example.com', password: 'password123' },
    
    // Empty strings (common in forms)
    { email: '', password: '' },
    
    // Null values (might happen with some form libraries)
    { email: null, password: null },
    
    // Undefined values
    { email: undefined, password: undefined },
    
    // Whitespace only
    { email: '   ', password: '   ' },
    
    // Mixed case with spaces
    { email: ' USER@EXAMPLE.COM ', password: ' password123 ' },
    
    // JSON parsing issues - strings instead of proper values
    { email: 'null', password: 'undefined' },
    
    // Common validation issues in forms
    { email: 'user@domain', password: 'pass' },
    
    // Buffer or array (edge case)
    { email: ['user@example.com'], password: ['password'] },
    
    // Additional fields that might be stripped
    { email: 'user@example.com', password: 'password123', extra: 'data', token: 'abc' }
];

console.log('🔍 Testing Production-like scenarios...\n');

function testWithValidation(testCase, index) {
    console.log(`--- Test ${index + 1} ---`);
    console.log('Input:', JSON.stringify(testCase, null, 2));
    
    const { error, value } = userLoginSchema.validate(testCase, { 
        abortEarly: false,
        stripUnknown: true
    });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        console.log('❌ Validation failed:', errorMessages);
        console.log('Error details:', error.details.map(d => ({
            path: d.path,
            type: d.type,
            message: d.message,
            value: d.context?.value
        })));
    } else {
        console.log('✅ Validation passed:', value);
    }
    console.log('---\n');
}

// Test all cases
prodTestCases.forEach(testWithValidation);

// Test with different NODE_ENV settings
console.log('🌍 Testing environment-specific behavior...\n');

// Simulate production environment
process.env.NODE_ENV = 'production';
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test a failing case in "production"
const failingCase = { email: '', password: '' };
console.log('Testing empty strings in production mode:');
testWithValidation(failingCase, 0);

console.log('🏁 Production tests completed');
