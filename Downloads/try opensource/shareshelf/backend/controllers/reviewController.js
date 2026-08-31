const Review = require('../models/Review');
const BorrowRequest = require('../models/BorrowRequest');
const User = require('../models/User');
const { calculateTrustScore } = require('../utils/trustScoreCalculator');

// @route   POST /api/reviews
// @desc    Create a review for a borrow request
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { borrowRequestId, rating, comment, reviewType } = req.body;
    const reviewerId = req.userId;

    // Validate borrow request exists and is completed
    const borrowRequest = await BorrowRequest.findById(borrowRequestId).populate(
      'borrowerId ownerId'
    );

    if (!borrowRequest) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    if (borrowRequest.status !== 'returned') {
      return res.status(400).json({
        message: 'Can only review completed (returned) borrow requests',
      });
    }

    // Validate reviewer is either owner or borrower
    let revieweeId;
    if (reviewType === 'as_owner') {
      // Owner reviewing borrower
      if (borrowRequest.ownerId._id.toString() !== reviewerId) {
        return res.status(403).json({ message: 'Not authorized to leave this review' });
      }
      revieweeId = borrowRequest.borrowerId._id;
    } else if (reviewType === 'as_borrower') {
      // Borrower reviewing owner
      if (borrowRequest.borrowerId._id.toString() !== reviewerId) {
        return res.status(403).json({ message: 'Not authorized to leave this review' });
      }
      revieweeId = borrowRequest.ownerId._id;
    } else {
      return res.status(400).json({ message: 'Invalid review type' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      borrowRequestId,
      reviewerId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this request' });
    }

    // Validate rating and comment
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters' });
    }

    const review = new Review({
      borrowRequestId,
      reviewerId,
      revieweeId,
      rating,
      comment,
      reviewType,
    });

    await review.save();

    // Recalculate trust score for reviewee
    const newScore = await calculateTrustScore(revieweeId);
    await User.findByIdAndUpdate(revieweeId, { trustScore: newScore });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews for a user
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatar')
      .populate('borrowRequestId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ revieweeId: req.params.userId });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      reviews,
      stats: {
        totalReviews: total,
        averageRating: avgRating,
      },
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/reviews/:id
// @desc    Get a single review
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewerId', 'name avatar')
      .populate('revieweeId', 'name avatar')
      .populate('borrowRequestId');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/reviews/:id
// @desc    Update a review (only by reviewer)
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the reviewer
    if (review.reviewerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (comment && comment.length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    review = await review.save();

    // Recalculate trust score for reviewee
    const newScore = await calculateTrustScore(review.revieweeId);
    await User.findByIdAndUpdate(review.revieweeId, { trustScore: newScore });

    res.json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (only by reviewer)
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the reviewer
    if (review.reviewerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const revieweeId = review.revieweeId;

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate trust score for reviewee
    const newScore = await calculateTrustScore(revieweeId);
    await User.findByIdAndUpdate(revieweeId, { trustScore: newScore });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
