# 📱 ReMarket - Complete Features List

## Current Implementation Overview
This is a **Node.js/Express + MongoDB** marketplace application with **OTP email verification**. No MSIL integration is currently present in the codebase.

---

## 🔐 Authentication & User Management

### 1. User Registration (POST `/api/auth/register`)
- Create new user account with username, email, password
- Auto-generate 6-digit OTP and send via Gmail SMTP
- OTP expires in 10 minutes
- User marked as unverified until OTP confirmed
- Beautiful HTML email with brand styling

**Features:**
- Username uniqueness validation
- Email uniqueness validation
- Password hashing with bcrypt (10 salt rounds)
- Account deletion if email fails to send

### 2. Email Verification (POST `/api/auth/verify-otp`)
- Verify email with 6-digit OTP
- Check OTP expiry (10 minute window)
- Clear OTP after successful verification
- Send welcome email
- Issue JWT token for login
- Mark user as `isEmailVerified: true`

### 3. Resend OTP (POST `/api/auth/resend-otp`)
- Request new OTP if expired
- Invalidate old OTP
- Resend to email
- No rate limiting (unlimited requests)
- 60-second UI cooldown recommended

### 4. Login (POST `/api/auth/login`)
- Email + password authentication
- Verify email is verified before allowing login
- If unverified, return 403 with `requiresVerification: true`
- Issue 7-day JWT token on success
- Return user profile (id, username, email, createdAt)

### 5. Get Current User (GET `/api/auth/me`)
- Protected route (requires JWT token)
- Return authenticated user profile
- Includes `isEmailVerified` flag
- Password excluded from response

---

## 📦 Listings Management

### 1. Create Listing (POST `/api/listings`)
- **Protected** - Auth required
- Upload with image file (multer) or provide imageUrl
- Fields: title, description, price, category, imageUrl
- Categories: Electronics, Furniture, Clothing, Books, Vehicles, Other
- Auto-populate seller from authenticated user
- Default placeholder image if none provided
- Returns listing with seller populated

### 2. Browse All Listings (GET `/api/listings`)
- **Public** - No auth required
- Auto-excludes archived listings
- **Filters:**
  - Category filter: `?category=Electronics`
  - Price range: `?minPrice=10&maxPrice=500`
  - Keyword search: `?search=iphone` (searches title + description)
  - Sort options: `?sort=price_asc|price_desc|newest|oldest`
  - Pagination: `?page=1&limit=12`
- Auto-archives listings older than 30 days (if not sold)
- Includes seller info (username, email)
- Returns pagination metadata (currentPage, totalPages, hasMore)

### 3. View Listing Details (GET `/api/listings/:id`)
- **Public** - No auth required
- Auto-increments view count
- Populates full seller info (username, email, createdAt)
- Shows all listing details (title, price, category, views, status)

### 4. My Listings (GET `/api/listings/my`)
- **Protected** - Auth required
- Returns all listings by current user (including archived & sold)
- Includes status field (active/sold/archived)
- Sorted by newest first

### 5. Update Listing (PUT `/api/listings/:id`)
- **Protected** - Auth required
- Owner-only modification
- Can update: title, description, price, category, imageUrl
- Supports new image upload (multer)
- Triggers Mongoose validation
- Returns updated listing with seller info

### 6. Mark as Sold (PATCH `/api/listings/:id/sold`)
- **Protected** - Auth required
- Owner-only
- Toggle isSold status (true ↔ false)
- Returns updated listing

### 7. Delete Listing (DELETE `/api/listings/:id`)
- **Protected** - Auth required
- Owner-only deletion
- Permanent removal

### 8. Archive/Unarchive Listing (POST `/api/listings/:id/archive`)
- **Protected** - Auth required
- Owner-only
- Toggle `isArchived` status
- Archived listings hidden from browse/search

### 9. Re-list Archived Listing (POST `/api/listings/:id/relist`)
- **Protected** - Auth required
- Owner-only
- Set `isArchived: false`
- Reset views to 0 (fresh start)
- Update `updatedAt` timestamp (appears newer)

---

## 📊 Seller Dashboard

### Seller Metrics (GET `/api/listings/dashboard/seller`)
- **Protected** - Auth required

**Summary Data:**
- Total listings created by seller
- Active listings (not sold, not archived)
- Sold listings count
- Archived listings count
- Total views across all listings
- Total inquiries received
- Average response time (in hours)

**Per-Listing Metrics:**
- Listing title, views, inquiries
- Status (active/sold/archived)
- Creation date

**Metrics Calculation:**
- Views: Sum of all listing views
- Inquiries: Count from Inquiry collection
- Response time: Average time between consecutive buyer inquiries

---

## 💬 Buyer-Seller Communication (Inquiries)

### 1. Send Inquiry (POST `/api/inquiries`)
- **Protected** - Auth required
- Body: `{ listingId, message }`
- Buyer sends message about a listing
- Prevents sellers from inquiring on own listings
- Populates buyer & seller info on response
- Links to listing (title, price, imageUrl)

### 2. Get Received Inquiries (GET `/api/inquiries/received`)
- **Protected** - Auth required
- Returns all inquiries where current user is seller
- Populates: listing details, buyer info
- Sorted by newest first
- Use case: Seller sees buyer inquiries

### 3. Get Sent Inquiries (GET `/api/inquiries/sent`)
- **Protected** - Auth required
- Returns all inquiries sent by current user (as buyer)
- Populates: listing details, seller info
- Sorted by newest first
- Use case: Buyer tracks their inquiries

---

## 📋 Data Models

### User Model
```javascript
{
  username: String (unique, 3+ chars),
  email: String (unique, valid format),
  password: String (6+ chars, hashed),
  otp: String (6 digits, null after verification),
  otpExpiry: Date (10 min from generation),
  isEmailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Listing Model
```javascript
{
  title: String (required),
  description: String (required),
  price: Number (0+),
  category: String (enum: Electronics, Furniture, Clothing, Books, Vehicles, Other),
  imageUrl: String (default: placeholder),
  seller: ObjectId (ref: User, required),
  isSold: Boolean (default: false),
  views: Number (default: 0, increments on GET),
  isArchived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Inquiry Model
```javascript
{
  listing: ObjectId (ref: Listing, required),
  buyer: ObjectId (ref: User, required),
  seller: ObjectId (ref: User, required),
  message: String (required, 1-1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with 7-day expiry
- Bearer token in Authorization header
- Protected routes require valid token
- Owner-only modifications (listings, inquiries)
- Seller cannot inquiry own listings

### Password Security
- Bcrypt hashing with 10 salt rounds
- Never returned in API responses
- 6+ character minimum requirement

### OTP Security
- 6-digit random code (1M combinations)
- 10-minute expiry window
- Cleared after verification
- Prevents fake email registrations

### Email Security
- Gmail SMTP with TLS/SSL
- App-specific password (not main account password)
- User credentials from `.env` file
- Account deletion if email send fails

---

## 📧 Email Notifications

### 1. OTP Verification Email
- Beautiful HTML template
- Shows 6-digit OTP prominently
- Displays 10-minute expiry
- Professional gradient header
- Brand styling (ReMarket)

### 2. Welcome Email
- Sent after successful verification
- Congratulations message
- Lists available features
- Professional footer

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | Bcrypt |
| **Email Service** | Nodemailer (Gmail SMTP) |
| **File Upload** | Multer (image handling) |
| **Validation** | Mongoose Schema validation |
| **CORS** | Enabled (cross-origin requests) |

---

## 🚀 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/auth/register` | ❌ | Create account + send OTP |
| **POST** | `/api/auth/verify-otp` | ❌ | Verify email with OTP |
| **POST** | `/api/auth/resend-otp` | ❌ | Request new OTP |
| **POST** | `/api/auth/login` | ❌ | Login with email & password |
| **GET** | `/api/auth/me` | ✅ | Get current user profile |
| **GET** | `/api/listings` | ❌ | Browse all listings (filtered) |
| **GET** | `/api/listings/:id` | ❌ | View listing details (+ views++) |
| **GET** | `/api/listings/my` | ✅ | My listings (all statuses) |
| **POST** | `/api/listings` | ✅ | Create new listing |
| **PUT** | `/api/listings/:id` | ✅ | Update listing (owner only) |
| **PATCH** | `/api/listings/:id/sold` | ✅ | Toggle sold status |
| **DELETE** | `/api/listings/:id` | ✅ | Delete listing |
| **POST** | `/api/listings/:id/archive` | ✅ | Archive/unarchive |
| **POST** | `/api/listings/:id/relist` | ✅ | Re-list archived listing |
| **GET** | `/api/listings/dashboard/seller` | ✅ | Seller dashboard metrics |
| **POST** | `/api/inquiries` | ✅ | Send inquiry to seller |
| **GET** | `/api/inquiries/received` | ✅ | Seller's received inquiries |
| **GET** | `/api/inquiries/sent` | ✅ | Buyer's sent inquiries |

---

## 🔄 Key Workflows

### 1. Registration to Login Flow
1. User submits registration form
2. Backend creates user (unverified)
3. OTP generated & sent via email
4. User verifies OTP
5. User marked as verified
6. JWT token issued
7. User redirected to home (logged in)

### 2. Listing Lifecycle
- **Day 0-29**: Listing active & visible
- **Day 30+**: Auto-archived (if not sold)
- **Seller can**: Archive manually, Re-list, Mark sold, Edit, Delete
- **View tracking**: Increments each GET request
- **Inquiry tracking**: Tracked per listing/seller

### 3. Buyer-Seller Interaction
1. Buyer browses listings
2. Buyer sends inquiry (message)
3. Seller receives inquiry notification (in `/inquiries/received`)
4. Seller can view buyer's message & listing details
5. Inquiry stored with timestamps for response time calc

---

## 📱 Features NOT Currently Implemented

- ❌ Real-time messaging/chat
- ❌ Seller ratings/reviews
- ❌ Buyer ratings/reviews
- ❌ Payment integration (Stripe, PayPal)
- ❌ Shipping/address tracking
- ❌ Admin dashboard
- ❌ User reporting system
- ❌ Wishlist/favorites
- ❌ Search history
- ❌ Email notifications on inquiry
- ❌ Two-factor authentication
- ❌ Social login (Google, Facebook)
- ❌ Mobile app (web only)
- ❌ Image gallery uploads (single image only)
- ❌ Video listings
- ❌ Auction/bidding system

---

## 🎯 Current Status

✅ **Working Features:**
- User registration with email OTP verification
- Email-based authentication
- Listing CRUD operations
- Browse/filter/search listings
- Seller dashboard with metrics
- View tracking
- Auto-archival (30-day expiry)
- Manual archive/re-list
- Buyer-seller inquiry system
- JWT-based authorization

⚠️ **Notes:**
- No MSIL verification present (standard Gmail OTP used)
- Image upload via Multer (disk storage)
- No real-time features (REST API only)
- No payment integration
- No review/rating system

---

## 📝 Environment Variables Required

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/remarket

# Authentication
JWT_SECRET=your-secret-key-min-32-chars

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**Gmail Setup:**
1. Enable 2-Step Verification
2. Generate App Password (16 chars)
3. Use App Password in `.env` (NOT main account password)

---

## 🎓 Key Implementation Details

### Why Standard OTP?
- Simple email verification
- No OAuth complexity
- User controls verification (check email)
- Works with any email provider

### Why 6-Digit OTP?
- Balance between simplicity & security
- 1,000,000 combinations
- Easy to type/remember
- Standard industry practice

### Why 10-Minute Expiry?
- User time to check email
- Security (time-limited access)
- Not too long (prevent replay)
- Not too short (frustration)

### Why Auto-Archive at 30 Days?
- Keep marketplace fresh
- Prevent stale listings
- Encourage re-listing
- Easy re-list with view reset

### Why Seller Dashboard?
- Track listing performance
- Monitor buyer interest (views/inquiries)
- Identify popular items
- Measure response efficiency

---

## 📞 API Testing Examples

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Create Listing
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 12",
    "description": "Great condition",
    "price": 400,
    "category": "Electronics",
    "imageUrl": "https://..."
  }'
```

### 3. Browse Listings
```bash
curl "http://localhost:5000/api/listings?category=Electronics&minPrice=100&maxPrice=500&sort=price_asc"
```

### 4. Send Inquiry
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "listing_id_here",
    "message": "Is this still available?"
  }'
```

---

**Last Updated:** 2026-06-07  
**Version:** 1.0.0  
**Status:** Production Ready
