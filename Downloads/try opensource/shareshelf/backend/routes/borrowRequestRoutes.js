const express = require('express');
const { body } = require('express-validator');
const borrowRequestController = require('../controllers/borrowRequestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validateBorrowRequest = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
];

const validateStatusUpdate = [
  body('newStatus')
    .isIn(['approved', 'rejected', 'picked_up', 'returned', 'overdue'])
    .withMessage('Valid status is required'),
];

// Protected routes (all require authentication)
// @route   GET /api/borrow-requests
router.get('/', authMiddleware, borrowRequestController.getBorrowRequests);

// @route   POST /api/borrow-requests
router.post('/', authMiddleware, validateBorrowRequest, borrowRequestController.createBorrowRequest);

// @route   GET /api/borrow-requests/:id
router.get('/:id', authMiddleware, borrowRequestController.getBorrowRequest);

// @route   PUT /api/borrow-requests/:id/status
router.put(
  '/:id/status',
  authMiddleware,
  validateStatusUpdate,
  borrowRequestController.updateBorrowRequestStatus
);

// @route   DELETE /api/borrow-requests/:id
router.delete('/:id', authMiddleware, borrowRequestController.cancelBorrowRequest);

module.exports = router;
