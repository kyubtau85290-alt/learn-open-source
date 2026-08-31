const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
    },
    category: {
      type: String,
      enum: ['tools', 'electronics', 'sports', 'furniture', 'kitchen', 'other'],
      required: [true, 'Please provide a category'],
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    availableDates: [
      {
        startDate: Date,
        endDate: Date,
      },
    ],
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair'],
      default: 'good',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
