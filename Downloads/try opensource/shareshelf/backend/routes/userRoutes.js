const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
// @route   GET /api/users
router.get('/', userController.getAllUsers);

// @route   GET /api/users/:id
router.get('/:id', userController.getUser);

// Protected routes
// @route   GET /api/users/profile/me
router.get('/profile/me', authMiddleware, userController.getMyProfile);

// @route   PUT /api/users/:id
router.put('/:id', authMiddleware, userController.updateUser);

// @route   POST /api/users/:id/recalculate-trust
router.post('/:id/recalculate-trust', authMiddleware, userController.recalculateTrustScore);

module.exports = router;
