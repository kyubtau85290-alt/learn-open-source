const express = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation middleware
const validateItem = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['tools', 'electronics', 'sports', 'furniture', 'kitchen', 'other']).withMessage('Valid category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

// Public routes
// @route   GET /api/items
router.get('/', itemController.getItems);

// @route   GET /api/items/:id
router.get('/:id', itemController.getItem);

// @route   GET /api/items/user/:userId
router.get('/user/:userId', itemController.getUserItems);

// Protected routes
// @route   POST /api/items
router.post('/', authMiddleware, upload.array('images', 5), validateItem, itemController.createItem);

// @route   PUT /api/items/:id
router.put('/:id', authMiddleware, upload.array('images', 5), itemController.updateItem);

// @route   DELETE /api/items/:id
router.delete('/:id', authMiddleware, itemController.deleteItem);

module.exports = router;
