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