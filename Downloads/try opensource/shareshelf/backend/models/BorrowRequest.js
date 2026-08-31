const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Borrower ID is required'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked_up', 'returned', 'overdue'],
      default: 'requested',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    depositState: {
      type: String,
      enum: ['held', 'released', 'forfeited'],
      default: 'held',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
