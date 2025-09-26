const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('userType')
    .isIn(['farmer', 'consumer'])
    .withMessage('User type must be either farmer or consumer')
];

const loginValidation = [
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

module.exports = router;