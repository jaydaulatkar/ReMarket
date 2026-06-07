// backend/routes/inquiries.js
// ===========================================
// Inquiry Routes
// ===========================================
// Handles buyer-to-seller messaging about listings

const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// -------------------------------------------
// POST /api/inquiries
// -------------------------------------------
// Send an inquiry about a listing (protected)
// Body: { listingId, message }
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId || !message) {
      return res.status(400).json({ message: 'Please provide listingId and message.' });
    }

    // Find the listing to get seller info
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Prevent seller from sending inquiry to themselves
    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send an inquiry on your own listing.' });
    }

    // Create the inquiry
    const inquiry = await Inquiry.create({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      message
    });

    // Populate references for the response
    await inquiry.populate([
      { path: 'listing', select: 'title price imageUrl' },
      { path: 'buyer', select: 'username email' },
      { path: 'seller', select: 'username email' }
    ]);

    res.status(201).json({
      message: 'Inquiry sent successfully!',
      inquiry
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Send inquiry error:', error);
    res.status(500).json({ message: 'Server error sending inquiry.' });
  }
});

// -------------------------------------------
// GET /api/inquiries/received
// -------------------------------------------
// Get all inquiries received (as a seller) - protected
router.get('/received', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ seller: req.user._id })
      .populate('listing', 'title price imageUrl')
      .populate('buyer', 'username email')
      .sort({ createdAt: -1 });

    res.json({ inquiries });
  } catch (error) {
    console.error('Get received inquiries error:', error);
    res.status(500).json({ message: 'Server error fetching inquiries.' });
  }
});

// -------------------------------------------
// GET /api/inquiries/sent
// -------------------------------------------
// Get all inquiries sent (as a buyer) - protected
router.get('/sent', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate('listing', 'title price imageUrl')
      .populate('seller', 'username email')
      .sort({ createdAt: -1 });

    res.json({ inquiries });
  } catch (error) {
    console.error('Get sent inquiries error:', error);
    res.status(500).json({ message: 'Server error fetching inquiries.' });
  }
});

module.exports = router;
