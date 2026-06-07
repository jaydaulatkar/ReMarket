// backend/models/Inquiry.js
// ===========================================
// Inquiry Model
// ===========================================
// Represents a buyer's message/inquiry about a listing

const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
