// backend/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Other'] // Restricts to predefined categories for cleaner filtering
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300' // FALLBACK: Simplifies implementation so you don't waste hours dealing with raw image uploads right now
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isSold: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', ListingSchema);