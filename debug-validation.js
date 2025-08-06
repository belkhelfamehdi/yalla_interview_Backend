const Joi = require('joi');

// Test the exact validation schema from the middleware
const userLoginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
});

// Test different login payloads
const testCases = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'TEST@EXAMPLE.COM', password: 'password123' },
    { email: '  test@example.com  ', password: 'password123' },
    { email: 'invalid-email', password: 'password123' },
    { email: 'test@example.com', password: '' },
    { email: '', password: 'password123' },
    {},
    { email: 'test@example.com' },
    { password: 'password123' }
];

console.log('🔍 Testing validation schema...\n');

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}:`, testCase);
    
    const { error, value } = userLoginSchema.validate(testCase, { 
        abortEarly: false,
        stripUnknown: true
    });
    
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        console.log('❌ Validation failed:', errorMessages);
    } else {
        console.log('✅ Validation passed:', value);
    }
    console.log('---');
});
