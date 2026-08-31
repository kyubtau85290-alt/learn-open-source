const Item = require('../models/Item');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, category, depositAmount, location, condition } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_NAME) {
        // Upload to Cloudinary
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'shareshelf/items',
          });
          images.push(result.secure_url);
        }
      } else {
        // Use local file paths
        images = req.files.map((f) => `/uploads/${f.filename}`);
      }
    }

    const item = new Item({
      ownerId: req.userId,
      title,
      description,
      category,
      depositAmount,
      location,
      condition,
      images,
    });

    await item.save();

    res.status(201).json({
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/items
// @desc    Get all items with filters
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    const { category, location, page = 1, limit = 12, search } = req.query;

    let filter = { availability: true };

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const items = await Item.find(filter)
      .populate('ownerId', 'name email location trustScore avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(filter);

    res.json({
      items,
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

// @route   GET /api/items/:id
// @desc    Get item details
// @access  Public
exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'ownerId',
      'name email location trustScore avatar bio phone'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, category, depositAmount, location, condition, availability } =
      req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (depositAmount !== undefined) item.depositAmount = depositAmount;
    if (location) item.location = location;
    if (condition) item.condition = condition;
    if (availability !== undefined) item.availability = availability;

    item = await item.save();

    res.json({
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/items/user/:userId
// @desc    Get all items listed by a user
// @access  Public
exports.getUserItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const items = await Item.find({ ownerId: req.params.userId })
      .populate('ownerId', 'name email location trustScore avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments({ ownerId: req.params.userId });

    res.json({
      items,
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
