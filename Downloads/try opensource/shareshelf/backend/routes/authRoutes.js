const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('location').trim().notEmpty().withMessage('Location/pincode is required'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// @route   POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// @route   POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

module.exports = router;
