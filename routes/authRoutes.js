const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');
const { validateUserRegistration, validateUserLogin } = require('../middlewares/validationMiddleware');
const { authLimiter, uploadLimiter } = require('../middlewares/securityMiddleware');

const router = express.Router();

// Auth routes with rate limiting and validation
router.post('/register', authLimiter, validateUserRegistration, registerUser);
router.post('/login', authLimiter, validateUserLogin, loginUser);
router.get('/profile', protect, getUserProfile);

// Temporary login without validation for debugging
router.post('/login-debug', authLimiter, async (req, res) => {
    console.log('🔧 Login debug - no validation:', req.body);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required',
                received: { email, password }
            });
        }
        
        // Import User here to avoid circular imports
        const User = require('../models/User');
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }
        
        const generateToken = (userId) => {
            return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        };
        
        res.status(200).json({
            success: true,
            message: 'Login successful (debug)',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        });
        
    } catch (error) {
        console.error('Debug login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Upload route with enhanced security
router.post('/upload-image', 
    uploadLimiter,
    upload.single("image"), 
    handleMulterError,
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'No file uploaded' 
            });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ 
            success: true,
            message: 'Image uploaded successfully',
            data: { imageUrl }
        });
    }
);

module.exports = router;