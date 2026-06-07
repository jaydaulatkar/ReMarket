# 🏪 ReMarket - Second-Hand Marketplace

A modern, full-stack second-hand marketplace platform built with **Node.js/Express**, **MongoDB**, and **React with Vite**. Buy and sell items in your community with ease!

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Authentication & User Management
- ✅ User registration (username, email, password)
- ✅ User login (email, password)
- ✅ JWT token authentication (7-day expiry)
- ✅ Password hashing with bcrypt
- ✅ Get user profile (protected route)

### Listings Management
- ✅ Create listings (with title, description, price, category, image)
- ✅ Browse all listings with filters (category, price range, keyword search)
- ✅ View listing details (auto-increments views)
- ✅ Edit listings (owner only)
- ✅ Delete listings (owner only)
- ✅ Mark listings as sold (toggle)
- ✅ View own listings (including archived & sold)
- ✅ Sorting (price asc/desc, newest/oldest)
- ✅ Pagination (customizable limit & page)

### Listing Expiry & Archive System
- ✅ Auto-archive listings older than 30 days (if not sold)
- ✅ Manual archive/unarchive listings
- ✅ Re-list archived listings (resets views, updates timestamp)
- ✅ Archived listings hidden from browse/search

### View Tracking
- ✅ Auto-increment views on listing view
- ✅ Display view count on listings
- ✅ Track total views in seller dashboard

### Seller Dashboard
- ✅ View seller metrics (total listings, active, sold, archived)
- ✅ Total views across all listings
- ✅ Total inquiries received
- ✅ Average response time to buyer inquiries
- ✅ Per-listing performance metrics (views, inquiries, status)

### Buyer-Seller Communication
- ✅ Send inquiries about listings (message sellers)
- ✅ View received inquiries (seller perspective)
- ✅ View sent inquiries (buyer perspective)
- ✅ Inquiry history with timestamps

### Categories
Supported categories:
- Electronics
- Furniture
- Clothing
- Books
- Vehicles
- Other

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js 20+ |
| **API Framework** | Express.js |
| **Database** | MongoDB |
| **ORM** | Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | Bcrypt |
| **Frontend** | React 19 |
| **Build Tool** | Vite |
| **HTTP Client** | Axios |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **File Upload** | Multer |
| **CORS** | Enabled |

---

## 📦 Installation

### Prerequisites
- **Node.js** v20.15.1+ ([Download](https://nodejs.org/))
- **npm** v10+
- **MongoDB Atlas Account** ([Create Free](https://www.mongodb.com/cloud/atlas))
- **Git** (optional)

### Backend Setup

**Step 1: Navigate to Backend**
```bash
cd Backend
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Create `.env` File**
Create `Backend/.env` with the following:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/remarket
JWT_SECRET=your-secret-key-min-32-characters-long
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

**Step 4: Configure MongoDB**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/remarket`
5. Update `MONGO_URI` in `.env`

### Frontend Setup

**Step 1: Navigate to Frontend**
```bash
cd Frontend
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: No Configuration Needed**
Frontend automatically connects to `http://localhost:5000` (backend)

---

## 🚀 Running the Project

### Start Backend Server

```bash
cd Backend
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running on port 5000
📡 API available at http://localhost:5000
```

### Start Frontend Server

Open **NEW terminal**:

```bash
cd Frontend
npm run dev
```

**Expected Output:**
```
VITE v8.0.16  ready in 307 ms

  ➜  Local:   http://localhost:5173/
  ➜  press q to quit
```

### Access the Application

Open your browser:
```
http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/auth/register` | ❌ | Register new user |
| **POST** | `/api/auth/login` | ❌ | Login user |
| **GET** | `/api/auth/me` | ✅ | Get current user profile |

### Listing Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **GET** | `/api/listings` | ❌ | Browse all listings (with filters) |
| **GET** | `/api/listings/my` | ✅ | Get my listings |
| **GET** | `/api/listings/:id` | ❌ | Get listing details (increments views) |
| **POST** | `/api/listings` | ✅ | Create listing |
| **PUT** | `/api/listings/:id` | ✅ | Update listing (owner only) |
| **PATCH** | `/api/listings/:id/sold` | ✅ | Toggle sold status |
| **DELETE** | `/api/listings/:id` | ✅ | Delete listing (owner only) |
| **POST** | `/api/listings/:id/archive` | ✅ | Archive/unarchive listing |
| **POST** | `/api/listings/:id/relist` | ✅ | Re-list archived listing |
| **GET** | `/api/listings/dashboard/seller` | ✅ | Get seller dashboard metrics |

### Inquiry Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/inquiries` | ✅ | Send inquiry about listing |
| **GET** | `/api/inquiries/received` | ✅ | Get received inquiries (seller) |
| **GET** | `/api/inquiries/sent` | ✅ | Get sent inquiries (buyer) |

---

## 📊 Database Models

### User Model
```javascript
{
  username: String (unique, 3+ chars),
  email: String (unique, valid format),
  password: String (hashed, 6+ chars),
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
  seller: ObjectId (ref: User),
  isSold: Boolean (default: false),
  views: Number (default: 0),
  isArchived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Inquiry Model
```javascript
{
  listing: ObjectId (ref: Listing),
  buyer: ObjectId (ref: User),
  seller: ObjectId (ref: User),
  message: String (1-1000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📁 Project Structure

```
My-Marketplace/
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   └── Inquiry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── listings.js
│   │   └── inquiries.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── BrowsePage.jsx
│   │   │   ├── CreateListingPage.jsx
│   │   │   ├── EditListingPage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Security Features

### Authentication
- JWT tokens with 7-day expiry
- Bearer token in Authorization header
- Protected routes require valid token
- Owner-only modifications

### Password Security
- Bcrypt hashing (10 salt rounds)
- Never returned in API responses
- 6+ character minimum

### Authorization
- Owner-only listing edits/deletes
- Seller cannot inquire on own listings
- Token validation on protected routes

---

## 🧪 Testing the Application

### 1. Register a New Account
1. Go to `http://localhost:5173/register`
2. Enter: username, email, password, confirm password
3. Click "Sign Up"
4. ✅ Should redirect to home (logged in)

### 2. Create a Listing
1. Go to `http://localhost:5173/create-listing`
2. Fill in: title, description, price, category
3. Optionally upload image
4. Click "Create Listing"
5. ✅ Listing appears on browse page

### 3. Browse Listings
1. Go to `http://localhost:5173/browse`
2. Try filters: category, price range, search
3. Sort by: price, newest, oldest
4. Click on listing to view details
5. ✅ Views counter increments

### 4. Send Inquiry
1. View a listing (not your own)
2. Click "Send Inquiry"
3. Type message
4. Click "Send"
5. ✅ Inquiry sent to seller

### 5. Seller Dashboard
1. Go to `http://localhost:5173/profile`
2. View your dashboard metrics
3. See listings performance
4. ✅ View counts, inquiries tracked

---

## 🔄 Example API Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Listing
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 12",
    "description": "Great condition, minor scratches",
    "price": 400,
    "category": "Electronics",
    "imageUrl": "https://via.placeholder.com/300"
  }'
```

### Browse Listings
```bash
curl "http://localhost:5000/api/listings?category=Electronics&minPrice=100&maxPrice=500&sort=price_asc&page=1&limit=12"
```

### Send Inquiry
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "507f1f77bcf86cd799439011",
    "message": "Is this still available?"
  }'
```

---

## 🌟 Key Features Explained

### Listing Auto-Expiry
- Listings created more than 30 days ago are automatically archived
- Archived listings don't appear in browse/search
- Sellers can re-list to refresh (resets views, updates timestamp)
- Keeps marketplace fresh and current

### View Tracking
- Each listing view increments a counter
- Sellers see total views in dashboard
- Helps sellers identify popular items

### Seller Dashboard
- See all your listing metrics in one place
- Track buyer interest through views & inquiries
- Monitor average response time
- Identify which items are performing best

### Inquiry System
- Buyers message sellers about listings
- Sellers see all received inquiries
- Buyers track their sent inquiries
- No real-time chat (history-based)

---

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | Token signing key | `your-secret-key-min-32-chars` |
| `GMAIL_USER` | Email sender | `noreply@remarket.com` |
| `GMAIL_PASSWORD` | App password | `xxxx-xxxx-xxxx-xxxx` |

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Check `MONGO_URI` in `.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Ensure database user has correct permissions

### Frontend shows blank page
- Check browser console (F12 → Console)
- Verify backend is running on port 5000
- Clear browser cache (Ctrl+Shift+Del)

### Port already in use
```bash
# Check which process uses port 5000
netstat -ano | findstr :5000

# Check which process uses port 5173
netstat -ano | findstr :5173
```

### Image upload not working
- Ensure `uploads/` folder exists in Backend directory
- Check file permissions
- Verify image is valid format (jpg, png, gif)

---

## 📱 UI Pages

### Public Pages
- **Home** (`/`) - Hero section, categories, recent listings
- **Browse** (`/browse`) - Search, filter, sort listings
- **Listing Details** (`/listings/:id`) - Full listing info, inquiry form
- **Login** (`/login`) - Email & password login
- **Register** (`/register`) - Create new account

### Protected Pages (Logged-in Users)
- **Create Listing** (`/create-listing`) - Add new item for sale
- **Edit Listing** (`/edit-listing/:id`) - Modify your listings
- **Profile** (`/profile`) - Seller dashboard & metrics
- **My Listings** (in Profile) - View all your listings

---

## 🎯 Next Steps & Future Enhancements

Potential features to add:
- Real-time chat between buyers/sellers
- User reviews & ratings
- Payment integration (Stripe/PayPal)
- Email notifications on inquiry
- User wishlist/favorites
- Social login (Google, Facebook)
- Two-factor authentication
- Admin dashboard
- Shipping integration

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

Created as a take-home assignment for a marketplace platform.

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review API endpoint documentation
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**Happy Selling! 🎉**
#   R e M a r k e t  
 