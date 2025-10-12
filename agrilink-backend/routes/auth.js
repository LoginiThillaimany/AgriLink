const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Debug: Check if protect middleware is available
console.log('Protect middleware:', typeof authController.protect);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.put('/update-profile', authController.protect, authController.updateProfile);
router.put('/change-password', authController.protect, authController.changePassword);

module.exports = router;


// const express = require('express');
// const { signup, login, updateProfile, changePassword, forgotPassword, verifyOTP, resetPassword, protect } = require('../controllers/authController');

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/forgot-password', forgotPassword);
// router.post('/verify-otp', verifyOTP);
// router.post('/reset-password', resetPassword);

// // Protected routes
// router.put('/update-profile', protect, updateProfile);
// router.put('/change-password', protect, changePassword);

// module.exports = router;