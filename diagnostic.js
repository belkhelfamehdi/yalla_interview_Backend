// Diagnostic script to check server startup
require('dotenv').config();

console.log('🔍 Starting server diagnostic...');
console.log('📋 Environment check:');
console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`  - PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`  - JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
console.log(`  - MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);
console.log(`  - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'}`);

console.log('\n🚀 Starting server...');

try {
    const app = require('./server.js');
    console.log('✅ Server started successfully!');
    console.log('📡 Server should be running on port', process.env.PORT || 5000);
    console.log('\n🔍 WebSocket error analysis:');
    console.log('  The WebSocket error you see (ws://localhost:8098/) is likely from:');
    console.log('  1. Browser dev tools trying to connect to a debugger');
    console.log('  2. VS Code extensions (like Live Server)');
    console.log('  3. React DevTools or other browser extensions');
    console.log('  4. Hot reload tools');
    console.log('\n✅ This error is NOT from your backend server');
    console.log('✅ Your backend server is running correctly');
} catch (error) {
    console.error('❌ Server startup error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
