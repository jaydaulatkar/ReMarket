# 🏪 ReMarket

> A modern full-stack second-hand marketplace platform built with **Node.js**, **Express.js**, **MongoDB**, and **React + Vite**.
> Buy, sell, and connect with local buyers and sellers through a simple and intuitive marketplace experience.

---

## 🚀 Features

### 🔐 Authentication & User Management

* User Registration
* User Login
* JWT Authentication (7-day expiration)
* Secure password hashing with bcrypt
* Protected routes
* User profile retrieval

### 📦 Listings Management

* Create listings with images
* Browse marketplace listings
* Search by keyword
* Filter by category
* Filter by price range
* Sorting options:

  * Newest First
  * Oldest First
  * Price Low → High
  * Price High → Low
* Pagination support
* View listing details
* Edit listings (owner only)
* Delete listings (owner only)
* Mark listings as sold
* View personal listings

### 🗂️ Archive & Re-Listing System

* Automatic archival after 30 days
* Manual archive/unarchive
* Re-list archived items
* Hidden archived listings from public search
* View count reset on re-listing

### 👀 View Tracking

* Auto-increment listing views
* View count per listing
* Total seller views dashboard metric

### 📊 Seller Dashboard

Track marketplace performance through:

* Total listings
* Active listings
* Sold listings
* Archived listings
* Total views
* Total inquiries received
* Average response time
* Per-listing performance analytics

### 💬 Buyer–Seller Communication

* Send inquiries to sellers
* View received inquiries
* View sent inquiries
* Inquiry history with timestamps

### 🏷️ Supported Categories

* Electronics
* Furniture
* Clothing
* Books
* Vehicles
* Other

---

# 🛠️ Tech Stack

| Layer                | Technology      |
| -------------------- | --------------- |
| Backend              | Node.js 20+     |
| API Framework        | Express.js      |
| Database             | MongoDB Atlas   |
| ODM                  | Mongoose        |
| Authentication       | JWT             |
| Password Security    | Bcrypt          |
| Frontend             | React 19        |
| Build Tool           | Vite            |
| HTTP Client          | Axios           |
| Routing              | React Router v7 |
| File Uploads         | Multer          |
| Icons                | Lucide React    |
| Cross-Origin Support | CORS            |

---

# 📁 Project Structure

```text
My-Marketplace/
│
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   └── Inquiry.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── listings.js
│   │   └── inquiries.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── utils/
│   │   └── emailService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── BrowsePage.jsx
│   │   ├── CreateListingPage.jsx
│   │   ├── EditListingPage.jsx
│   │   ├── ListingDetailPage.jsx
│   │   └── ProfilePage.jsx
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ListingCard.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── README.md
└── package.json
```

---

# ⚙️ Installation

## Prerequisites

Before running the project, ensure you have:

* Node.js v20+
* npm v10+
* MongoDB Atlas Account
* Git (optional)

---

## Backend Setup

### 1. Navigate to Backend

```bash
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file inside the Backend folder.

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/remarket

JWT_SECRET=your-secret-key-minimum-32-characters

GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

### 4. Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Allow your IP address
4. Obtain the connection string
5. Update `MONGO_URI`

---

## Frontend Setup

### Navigate to Frontend

```bash
cd Frontend
```

### Install Dependencies

```bash
npm install
```

No additional configuration is required.

---

# ▶️ Running the Application

## Start Backend Server

```bash
cd Backend
npm start
```

Expected Output:

```bash
✅ MongoDB Connected
🚀 Server running on port 5000
📡 API available at http://localhost:5000
```

---

## Start Frontend

Open a new terminal:

```bash
cd Frontend
npm run dev
```

Expected Output:

```bash
VITE ready

Local:
http://localhost:5173
```

---

## Open the Application

```text
http://localhost:5173
```

---

# 📡 REST API

## Authentication

| Method | Endpoint             | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| POST   | `/api/auth/register` | ❌    | Register user        |
| POST   | `/api/auth/login`    | ❌    | Login user           |
| GET    | `/api/auth/me`       | ✅    | Current user profile |

---

## Listings

| Method | Endpoint                         | Auth | Description           |
| ------ | -------------------------------- | ---- | --------------------- |
| GET    | `/api/listings`                  | ❌    | Browse listings       |
| GET    | `/api/listings/my`               | ✅    | User listings         |
| GET    | `/api/listings/:id`              | ❌    | Listing details       |
| POST   | `/api/listings`                  | ✅    | Create listing        |
| PUT    | `/api/listings/:id`              | ✅    | Update listing        |
| PATCH  | `/api/listings/:id/sold`         | ✅    | Toggle sold status    |
| DELETE | `/api/listings/:id`              | ✅    | Delete listing        |
| POST   | `/api/listings/:id/archive`      | ✅    | Archive/Unarchive     |
| POST   | `/api/listings/:id/relist`       | ✅    | Re-list archived item |
| GET    | `/api/listings/dashboard/seller` | ✅    | Seller dashboard      |

---

## Inquiries

| Method | Endpoint                  | Auth | Description      |
| ------ | ------------------------- | ---- | ---------------- |
| POST   | `/api/inquiries`          | ✅    | Send inquiry     |
| GET    | `/api/inquiries/received` | ✅    | Seller inquiries |
| GET    | `/api/inquiries/sent`     | ✅    | Buyer inquiries  |

---

# 🗄️ Database Models

## User

```javascript
{
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Listing

```javascript
{
  title: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  seller: ObjectId,
  isSold: Boolean,
  views: Number,
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Inquiry

```javascript
{
  listing: ObjectId,
  buyer: ObjectId,
  seller: ObjectId,
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔐 Security Features

### Authentication

* JWT-based authentication
* 7-day token expiry
* Protected API routes
* Bearer token authorization

### Password Protection

* bcrypt hashing
* Passwords never exposed in responses
* Minimum password length validation

### Authorization

* Owner-only updates and deletions
* Sellers cannot inquire about their own listings
* Protected route middleware

---

# 🧪 Testing the Application

## Register a User

1. Visit `/register`
2. Create an account
3. Submit the form
4. Verify login redirect

## Create a Listing

1. Navigate to `/create-listing`
2. Fill item details
3. Upload image
4. Create listing

## Browse Listings

1. Visit `/browse`
2. Search items
3. Filter categories
4. Sort results
5. Open listing details

## Send Inquiry

1. Open another user's listing
2. Submit a message
3. Verify inquiry appears

## View Dashboard

1. Open `/profile`
2. Check analytics
3. Review listing performance

---

# 🌟 Core Marketplace Features

## Auto Expiry System

Listings older than 30 days are automatically archived.

Benefits:

* Keeps inventory fresh
* Reduces stale listings
* Improves browsing experience

---

## Seller Analytics

Provides visibility into:

* Listing performance
* Buyer interest
* Inquiry volume
* Marketplace engagement

---

## Inquiry System

A lightweight messaging workflow allowing:

* Buyer-to-seller communication
* Inquiry history tracking
* Marketplace engagement

---

# 📱 Pages

## Public Pages

| Route           | Description     |
| --------------- | --------------- |
| `/`             | Home            |
| `/browse`       | Browse Listings |
| `/listings/:id` | Listing Details |
| `/login`        | Login           |
| `/register`     | Registration    |

---

## Protected Pages

| Route               | Description    |
| ------------------- | -------------- |
| `/create-listing`   | Create Listing |
| `/edit-listing/:id` | Edit Listing   |
| `/profile`          | Dashboard      |
| `/my-listings`      | User Listings  |

---

# 🚀 Future Enhancements

* Real-time chat
* Email notifications
* Wishlist / favorites
* User ratings & reviews
* Stripe payments
* PayPal integration
* Social login (Google/Facebook)
* Two-factor authentication (2FA)
* Admin dashboard
* Shipping integration

---

# 🐛 Troubleshooting

## MongoDB Connection Issues

* Verify `MONGO_URI`
* Check Atlas IP whitelist
* Confirm database credentials

## Frontend Not Loading

* Ensure backend is running
* Check browser console
* Clear browser cache

## Port Already in Use

```bash
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

## Image Upload Problems

* Verify uploads directory exists
* Check permissions
* Confirm image format is supported

---

# 📄 License

Licensed under the MIT License.

---

# 👨‍💻 Author

Developed as a full-stack marketplace platform take-home assignment.

---

## ⭐ Support

If you encounter issues:

1. Review troubleshooting steps
2. Verify environment variables
3. Check API routes
4. Inspect browser console logs

---

**Happy Selling! 🎉**

