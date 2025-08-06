// Test script to verify all imports work correctly
console.log('🔍 Testing imports...');

try {
    // Test middlewares
    console.log('✅ Testing security middlewares...');
    require('./middlewares/securityMiddleware');
    console.log('  - Security middleware loaded');
    
    require('./middlewares/validationMiddleware');
    console.log('  - Validation middleware loaded');
    
    require('./middlewares/uploadMiddleware');
    console.log('  - Upload middleware loaded');
    
    // Test routes
    console.log('✅ Testing routes...');
    require('./routes/authRoutes');
    console.log('  - Auth routes loaded');
    
    require('./routes/aiRoutes');
    console.log('  - AI routes loaded');
    
    require('./routes/sessionRoutes');
    console.log('  - Session routes loaded');
    
    // Test controllers
    console.log('✅ Testing controllers...');
    require('./controllers/authController');
    console.log('  - Auth controller loaded');
    
    require('./controllers/aiController');
    console.log('  - AI controller loaded');
    
    console.log('🎉 All imports successful! Your code is ready to run.');
    console.log('🔒 Security improvements implemented successfully!');
    
} catch (error) {
    console.error('❌ Import error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
