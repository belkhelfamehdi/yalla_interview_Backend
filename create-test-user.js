require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function createTestUser() {
    console.log('🔗 Connecting to database...');
    await connectDB();
    
    const email = 'test@yalla.com';
    const password = 'password123';
    
    console.log('🧹 Cleaning existing test user...');
    await User.deleteOne({ email });
    
    console.log('🔐 Creating test user...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const testUser = await User.create({
        name: 'Test User',
        email: email,
        password: hashedPassword
    });
    
    console.log('✅ Test user created successfully:');
    console.log({
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        credentials: {
            email: email,
            password: password
        }
    });
    
    console.log('\n🔑 Use these credentials to test login:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
}

createTestUser().catch(error => {
    console.error('💥 Error creating test user:', error);
    process.exit(1);
});
