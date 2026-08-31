const BorrowRequest = require('../models/BorrowRequest');
const Item = require('../models/Item');
const User = require('../models/User');
const { calculateTrustScore } = require('../utils/trustScoreCalculator');
const { sendEmail } = require('../utils/sendEmail');

/**
 * State machine validation
 * Allowed transitions:
 * requested -> approved | rejected
 * approved -> picked_up
 * picked_up -> returned | overdue
 * overdue -> (stays overdue until returned)
 * returned -> (final state)
 */
const isValidStateTransition = (currentState, newState) => {
  const transitions = {
    requested: ['approved', 'rejected'],
    approved: ['picked_up', 'rejected'],
    picked_up: ['returned', 'overdue'],
    overdue: ['returned'],
    returned: [],
    rejected: [],
  };

  return transitions[currentState]?.includes(newState) ?? false;
};

// @route   POST /api/borrow-requests
// @desc    Create a borrow request
// @access  Private
exports.createBorrowRequest = async (req, res, next) => {
  try {
    const { itemId, dueDate, notes } = req.body;
    const borrowerId = req.userId;

    // Validate item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Prevent borrowing own item
    if (item.ownerId.toString() === borrowerId) {
      return res.status(400).json({ message: 'Cannot borrow your own item' });
    }

    // Check item availability
    if (!item.availability) {
      return res.status(400).json({ message: 'Item is not available' });
    }

    // Validate due date
    const dueDateObj = new Date(dueDate);
    if (dueDateObj <= new Date()) {
      return res.status(400).json({ message: 'Due date must be in the future' });
    }

    // Create request
    const borrowRequest = new BorrowRequest({
      itemId,
      borrowerId,
      ownerId: item.ownerId,
      dueDate: dueDateObj,
      notes,
    });

    await borrowRequest.save();

    // Populate before sending response
    await borrowRequest.populate('borrowerId ownerId itemId');

    // Send email to owner
    const owner = await User.findById(item.ownerId);
    const borrower = await User.findById(borrowerId);
    await sendEmail(
      owner.email,
      `New Borrow Request for "${item.title}"`,
      `
Hello ${owner.name},

${borrower.name} has requested to borrow "${item.title}".
Due date: ${dueDateObj.toDateString()}

Please log in to approve or reject this request.

Best regards,
ShareShelf Team
      `
    );

    res.status(201).json({
      message: 'Borrow request created successfully',
      borrowRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/borrow-requests
// @desc    Get borrow requests (filtered by role)
// @access  Private
exports.getBorrowRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, role } = req.query;
    // role: 'borrower' or 'owner'

    let filter = {};

    if (role === 'borrower') {
      filter.borrowerId = req.userId;
    } else if (role === 'owner') {
      filter.ownerId = req.userId;
    } else {
      // Default: show requests for this user in any role
      filter.$or = [{ borrowerId: req.userId }, { ownerId: req.userId }];
    }

    if (status) {
      filter.status = status;
    }

    const requests = await BorrowRequest.find(filter)
      .populate('itemId borrowerId ownerId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await BorrowRequest.countDocuments(filter);

    res.json({
      requests,
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

// @route   GET /api/borrow-requests/:id
// @desc    Get single borrow request
// @access  Private
exports.getBorrowRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id).populate(
      'itemId borrowerId ownerId'
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is involved in this request
    if (
      request.borrowerId._id.toString() !== req.userId &&
      request.ownerId._id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/borrow-requests/:id/status
// @desc    Update borrow request status (state machine)
// @access  Private
exports.updateBorrowRequestStatus = async (req, res, next) => {
  try {
    const { newStatus } = req.body;

    let request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Validate state transition
    if (!isValidStateTransition(request.status, newStatus)) {
      return res.status(400).json({
        message: `Cannot transition from '${request.status}' to '${newStatus}'`,
        validTransitions: {
          requested: ['approved', 'rejected'],
          approved: ['picked_up', 'rejected'],
          picked_up: ['returned', 'overdue'],
          overdue: ['returned'],
        },
      });
    }

    // Owner-only operations
    if (newStatus === 'approved' || newStatus === 'rejected') {
      if (request.ownerId.toString() !== req.userId) {
        return res.status(403).json({ message: 'Only owner can approve/reject requests' });
      }

      if (newStatus === 'approved') {
        request.approvedAt = new Date();
        request.status = 'approved';

        // Mark item as unavailable
        await Item.findByIdAndUpdate(request.itemId, { availability: false });
      } else if (newStatus === 'rejected') {
        request.status = 'rejected';
      }
    }

    // Either party can mark as picked up
    if (newStatus === 'picked_up') {
      if (
        request.ownerId.toString() !== req.userId &&
        request.borrowerId.toString() !== req.userId
      ) {
        return res.status(403).json({ message: 'Not authorized for this action' });
      }
      request.pickedUpAt = new Date();
      request.status = 'picked_up';
    }

    // Either party can mark as returned
    if (newStatus === 'returned') {
      if (
        request.ownerId.toString() !== req.userId &&
        request.borrowerId.toString() !== req.userId
      ) {
        return res.status(403).json({ message: 'Not authorized for this action' });
      }
      request.returnedAt = new Date();
      request.status = 'returned';
      request.depositState = 'released';

      // Mark item as available again
      await Item.findByIdAndUpdate(request.itemId, { availability: true });

      // Recalculate trust score for borrower
      const newScore = await calculateTrustScore(request.borrowerId);
      await User.findByIdAndUpdate(request.borrowerId, { trustScore: newScore });
    }

    // Mark as overdue
    if (newStatus === 'overdue') {
      request.status = 'overdue';
      request.depositState = 'forfeited';

      // Increment borrower's overdue count and reduce trust
      await User.findByIdAndUpdate(request.borrowerId, { $inc: { overdueCount: 1 } });
    }

    request = await request.save();
    await request.populate('itemId borrowerId ownerId');

    // Send notification emails
    if (newStatus === 'approved') {
      const borrower = await User.findById(request.borrowerId);
      await sendEmail(
        borrower.email,
        `Your borrow request for "${request.itemId.title}" was approved!`,
        `
Hello ${borrower.name},

Great news! Your borrow request for "${request.itemId.title}" has been approved.
Due date: ${request.dueDate.toDateString()}

Please arrange pickup at your earliest convenience.

Best regards,
ShareShelf Team
      `
      );
    }

    res.json({
      message: `Request status updated to '${newStatus}'`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/borrow-requests/:id
// @desc    Cancel a borrow request (only if in 'requested' state)
// @access  Private
exports.cancelBorrowRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only borrower can cancel, and only in 'requested' state
    if (request.borrowerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    if (request.status !== 'requested') {
      return res.status(400).json({
        message: `Cannot cancel request in '${request.status}' state`,
      });
    }

    await BorrowRequest.findByIdAndDelete(req.params.id);

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
