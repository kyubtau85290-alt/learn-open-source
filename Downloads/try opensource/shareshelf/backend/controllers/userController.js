const User = require('../models/User');
const { calculateTrustScore } = require('../utils/trustScoreCalculator');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/profile/me
// @desc    Get current user profile
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const { name, location, bio, phone, avatar } = req.body;

    // Ensure user can only update their own profile
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    user = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users
// @desc    Get all users (for nearby users feature)
// @access  Public
exports.getAllUsers = async (req, res, next) => {
  try {
    const { location, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
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

// @route   POST /api/users/:id/recalculate-trust
// @desc    Recalculate trust score for a user
// @access  Private (admin or user themselves)
exports.recalculateTrustScore = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Verify user is updating their own trust score or is admin
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newScore = await calculateTrustScore(userId);

    const user = await User.findByIdAndUpdate(userId, { trustScore: newScore }, { new: true });

    res.json({
      message: 'Trust score recalculated',
      trustScore: user.trustScore,
    });
  } catch (error) {
    next(error);
  }
};
