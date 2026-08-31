const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    borrowRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowRequest',
      required: [true, 'Borrow request ID is required'],
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer ID is required'],
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      minlength: 10,
      maxlength: 500,
    },
    reviewType: {
      type: String,
      enum: ['as_owner', 'as_borrower'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
