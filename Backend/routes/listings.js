// backend/routes/listings.js
// ===========================================
// Listing Routes (CRUD + Browse/Search/Filter)
// ===========================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// -------------------------------------------
// GET /api/listings
// -------------------------------------------
// Browse all listings with optional filters
// Query params:
//   ?category=Electronics
//   ?minPrice=10&maxPrice=500
//   ?search=iphone
//   ?sort=price_asc | price_desc | newest | oldest
//   ?page=1&limit=12
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    // Build filter object dynamically
    const filter = { isArchived: false }; // Exclude archived listings

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Keyword search (searches title and description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Auto-archive listings older than 30 days (if not already sold)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Listing.updateMany(
      { createdAt: { $lt: thirtyDaysAgo }, isSold: false, isArchived: false },
      { isArchived: true }
    );

    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('seller', 'username email') // Include seller info
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter)
    ]);

    res.json({
      listings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalListings: total,
        hasMore: skip + listings.length < total
      }
    });
  } catch (error) {
    console.error('Browse listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings.' });
  }
});

// -------------------------------------------
// GET /api/listings/my
// -------------------------------------------
// Get all listings created by the currently logged-in user (including archived)
router.get('/my', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    // Include status info for UI
    const listingsWithStatus = listings.map(listing => ({
      ...listing.toObject(),
      status: listing.isArchived ? 'archived' : (listing.isSold ? 'sold' : 'active')
    }));

    res.json({ listings: listingsWithStatus });
  } catch (error) {
    console.error('My listings error:', error);
    res.status(500).json({ message: 'Server error fetching your listings.' });
  }
});

// -------------------------------------------
// GET /api/listings/:id
// -------------------------------------------
// Get a single listing by ID with full seller info
// Increments view count
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'username email createdAt');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json({ listing });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error fetching listing.' });
  }
});

// -------------------------------------------
// POST /api/listings
// -------------------------------------------
// Create a new listing (protected - must be logged in)
// Body: { title, description, price, category, imageUrl? } or FormData with 'image' file
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    let imageUrl = req.body.imageUrl; // Use provided URL if available

    // If a physical file was uploaded, construct its local URL path
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      imageUrl: imageUrl || undefined, // Use default from schema if not provided
      seller: req.user._id
    });

    // Populate seller info before responding
    await listing.populate('seller', 'username email');

    res.status(201).json({
      message: 'Listing created successfully!',
      listing
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error creating listing.' });
  }
});

// -------------------------------------------
// PUT /api/listings/:id
// -------------------------------------------
// Update a listing (protected - only the owner can edit)
// Body: { title?, description?, price?, category?, imageUrl? } or FormData with 'image' file
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Ownership check: only the seller can edit
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own listings.' });
    }

    // Update only the fields that were provided
    const { title, description, price, category, imageUrl } = req.body;
    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (price !== undefined) listing.price = price;
    if (category !== undefined) listing.category = category;
    
    if (req.file) {
      listing.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      listing.imageUrl = imageUrl;
    }

    await listing.save(); // Triggers Mongoose validation
    await listing.populate('seller', 'username email');

    res.json({
      message: 'Listing updated successfully!',
      listing
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error updating listing.' });
  }
});

// -------------------------------------------
// PATCH /api/listings/:id/sold
// -------------------------------------------
// Toggle the sold status of a listing (protected - owner only)
router.patch('/:id/sold', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only modify your own listings.' });
    }

    // Toggle sold status
    listing.isSold = !listing.isSold;
    await listing.save();
    await listing.populate('seller', 'username email');

    res.json({
      message: listing.isSold ? 'Listing marked as sold!' : 'Listing marked as available!',
      listing
    });
  } catch (error) {
    console.error('Toggle sold error:', error);
    res.status(500).json({ message: 'Server error updating sold status.' });
  }
});

// -------------------------------------------
// DELETE /api/listings/:id
// -------------------------------------------
// Delete a listing (protected - owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully!' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error deleting listing.' });
  }
});

// -------------------------------------------
// GET /api/listings/dashboard/seller
// -------------------------------------------
// Get seller dashboard with metrics (protected)
// Returns: views count, inquiry count, sold listings, active listings, response time
router.get('/dashboard/seller', auth, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get all listings by seller
    const listings = await Listing.find({ seller: sellerId });
    const listingIds = listings.map(l => l._id);

    // Calculate metrics
    const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
    const soldListings = listings.filter(l => l.isSold).length;
    const activeListings = listings.filter(l => !l.isSold && !l.isArchived).length;
    const archivedListings = listings.filter(l => l.isArchived).length;

    // Get inquiry stats
    const inquiries = await require('../models/Inquiry').find({ seller: sellerId });
    const totalInquiries = inquiries.length;

    // Calculate average response time (in hours)
    // Response time = if inquiry has a corresponding later inquiry from same buyer on another listing
    let totalResponseTime = 0;
    let responseCount = 0;
    
    inquiries.forEach(inquiry => {
      const buyerInquiries = inquiries.filter(i => i.buyer.toString() === inquiry.buyer.toString());
      if (buyerInquiries.length > 1) {
        const sortedByDate = buyerInquiries.sort((a, b) => a.createdAt - b.createdAt);
        for (let i = 0; i < sortedByDate.length - 1; i++) {
          const timeDiff = (sortedByDate[i + 1].createdAt - sortedByDate[i].createdAt) / (1000 * 60 * 60);
          totalResponseTime += timeDiff;
          responseCount++;
        }
      }
    });

    const avgResponseTime = responseCount > 0 ? (totalResponseTime / responseCount).toFixed(1) : 0;

    // Get detailed listing metrics
    const listingMetrics = listings.map(listing => ({
      id: listing._id,
      title: listing.title,
      views: listing.views,
      inquiries: inquiries.filter(i => i.listing.toString() === listing._id.toString()).length,
      isSold: listing.isSold,
      isArchived: listing.isArchived,
      createdAt: listing.createdAt
    }));

    res.json({
      summary: {
        totalListings: listings.length,
        activeListings,
        soldListings,
        archivedListings,
        totalViews,
        totalInquiries,
        avgResponseTimeHours: parseFloat(avgResponseTime)
      },
      listingMetrics
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard.' });
  }
});

// -------------------------------------------
// POST /api/listings/:id/relist
// -------------------------------------------
// Re-list an archived or old listing (protected - owner only)
router.post('/:id/relist', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only re-list your own listings.' });
    }

    // Unarchive and reset views for fresh listing
    listing.isArchived = false;
    listing.views = 0;
    listing.updatedAt = new Date();
    await listing.save();
    await listing.populate('seller', 'username email');

    res.json({
      message: 'Listing re-listed successfully! It will appear fresh on the marketplace.',
      listing
    });
  } catch (error) {
    console.error('Re-list error:', error);
    res.status(500).json({ message: 'Server error re-listing.' });
  }
});

// -------------------------------------------
// POST /api/listings/:id/archive
// -------------------------------------------
// Manually archive a listing (protected - owner only)
router.post('/:id/archive', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only archive your own listings.' });
    }

    listing.isArchived = !listing.isArchived;
    await listing.save();
    await listing.populate('seller', 'username email');

    res.json({
      message: listing.isArchived ? 'Listing archived successfully!' : 'Listing unarchived!',
      listing
    });
  } catch (error) {
    console.error('Archive error:', error);
    res.status(500).json({ message: 'Server error archiving listing.' });
  }
});

module.exports = router;
