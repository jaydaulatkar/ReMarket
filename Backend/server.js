// backend/server.js
// ===========================================
// Main entry point for the Marketplace API
// ===========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// -------------------------------------------
// MIDDLEWARE
// -------------------------------------------

// Parse incoming JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
// This allows our React frontend (running on a different port/domain) to make API requests
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://remarket-frontend.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// -------------------------------------------
// DATABASE CONNECTION
// -------------------------------------------

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// -------------------------------------------
// ROUTES
// -------------------------------------------

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    message: 'Marketplace API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      listings: '/api/listings',
      inquiries: '/api/inquiries'
    }
  });
});

// Mount route files (we'll create these next)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/inquiries', require('./routes/inquiries'));

// -------------------------------------------
// ERROR HANDLING MIDDLEWARE
// -------------------------------------------

// Handle 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
// Catches any errors thrown in route handlers or middleware
app.use((err, req, res, next) => {
  console.error(`🔥 Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// -------------------------------------------
// START SERVER
// -------------------------------------------

const PORT = process.env.PORT || 5000;

// Connect to database first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
  });
});
