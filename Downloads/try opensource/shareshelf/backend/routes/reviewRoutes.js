const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validateReview = [
  body('borrowRequestId').notEmpty().withMessage('Borrow request ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  body('reviewType').isIn(['as_owner', 'as_borrower']).withMessage('Valid review type is required'),
];

// Public routes
// @route   GET /api/reviews/user/:userId
router.get('/user/:userId', reviewController.getUserReviews);

// @route   GET /api/reviews/:id
router.get('/:id', reviewController.getReview);

// Protected routes
// @route   POST /api/reviews
router.post('/', authMiddleware, validateReview, reviewController.createReview);

// @route   PUT /api/reviews/:id
router.put('/:id', authMiddleware, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
