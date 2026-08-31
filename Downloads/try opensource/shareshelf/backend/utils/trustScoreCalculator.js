const Review = require('../models/Review');
const BorrowRequest = require('../models/BorrowRequest');

/**
 * Calculate trust score for a user based on completed swaps and reviews
 * Logic:
 * - Base score: 50
 * - +2 for each on-time return
 * - -5 for each overdue return
 * - Review ratings: average rating weighted into final score
 * - Capped between 0-100
 */
const calculateTrustScore = async (userId) => {
  try {
    // Get all completed borrow requests for this user as a borrower
    const completedRequests = await BorrowRequest.find({
      borrowerId: userId,
      status: 'returned',
    });

    const overdueRequests = await BorrowRequest.find({
      borrowerId: userId,
      status: 'overdue',
    });

    // Get all reviews for this user
    const reviews = await Review.find({ revieweeId: userId });

    // Calculate score
    let score = 50; // Base score

    // Add points for on-time returns
    score += completedRequests.length * 2;

    // Subtract points for overdue returns
    score -= overdueRequests.length * 5;

    // Apply review rating weight
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      // Weight: each rating point (1-5) can adjust score by up to 15 points
      const ratingAdjustment = (avgRating - 3) * 7.5; // 3 is neutral (no change)
      score += ratingAdjustment;
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
  } catch (error) {
    console.error('Error calculating trust score:', error);
    return 50; // Return base score on error
  }
};

module.exports = { calculateTrustScore };
