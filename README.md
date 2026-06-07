# Tech Mart IIIT: Buy, Sell & Rent Platform

Tech Mart IIIT is a comprehensive full-stack marketplace application built on the MERN stack. It provides a secure, dynamic platform for users to buy, sell, rent, and deliver items within the IIIT community. The application boasts a premium dark-mode aesthetic with interactive glassmorphism UI elements and is fortified with robust security, including Google ReCAPTCHA v2 and persistent session handling.

---

## 🌟 Key Features

### 1. **Premium Dark Mode & Glassmorphism Design**
- A highly polished, cohesive dark-theme design system using CSS variables (`index.css`).
- Translucent "frosted glass" containers with blur filters.
- Fluid modern typography powered by Google Fonts (Inter).
- Dynamic micro-animations, glowing hover effects, and premium button styling.
- Fully horizontal, responsive sticky flexbox Navigation Bar.

### 2. **Secure Authentication & Session Management**
- Secure password hashing using `bcryptjs`.
- Cross-domain persistent user sessions using `express-session` and `connect-mongo`.
- Automated session cookie handling designed for separated frontend/backend deployments.
- **Google ReCAPTCHA v2** integration to prevent bot signups and brute-force login attempts.

### 3. **Marketplace Functionality**
- **Dashboard (Home):** Browse products via interactive grid cards with image previews, pricing, and pagination.
- **Selling & Listing:** Users can seamlessly upload their own products, categorize them, and specify pricing.
- **Product Details:** Dedicated dynamic product pages with detailed descriptions, seller info, and interactive "Add to Cart" functionality.
- **Shopping Cart:** Manage quantities, view dynamically calculated totals, and seamlessly place orders.
- **Orders Dashboard:** Track order history and view items sold.
- **Deliveries:** Specialized dashboard for managing local deliveries.

### 4. **AI Chatbot Integration**
- Built-in intelligent chatbot powered by **Google Generative AI (Gemini 2.5 Flash)**.
- Context-aware chat history stored in secure user sessions for continuous conversational flows.

### 5. **Production-Ready Deployment Configurations**
- **Frontend (Netlify):** Optimized build scripts, custom `_redirects` file for React Router SPA compatibility, and strict ESLint warning resolution.
- **Backend (Render):** Dynamic Port binding, environmental secrets, and robust CORS configuration to allow cross-origin requests specifically from the configured frontend.

---

## 📂 File Structure

The project is structured into two completely independent directories to allow for separate hosting (e.g., Netlify for Frontend, Render for Backend).

```text
Buy_Sell_Rent-IIITH/
├── .gitignore                     # Root gitignore blocking node_modules and .env files
├── README.md                      # This documentation file
│
├── backend/                       # Node.js / Express API Server
│   ├── package.json               # Backend dependencies (express, mongoose, bcrypt, etc.)
│   ├── server.js                  # Main server entrypoint (Routes, MongoDB config, Auth, AI config)
│   ├── .env                       # Backend secrets (DB_URI, API_KEY, SESSION_SECRET, FRONTEND_URL, PORT)
│   └── node_modules/              
│
└── frontend/                      # React Single Page Application (SPA)
    ├── package.json               # Frontend dependencies (react, react-router-dom, axios, etc.)
    ├── .env.example               # Template for frontend environment variables
    ├── .gitignore                 
    │
    ├── public/
    │   ├── index.html             # HTML entry point (contains Google Fonts import)
    │   └── _redirects             # Netlify configuration file for React Router handling
    │
    └── src/
        ├── index.js               # React DOM rendering and global Axios configuration
        ├── App.js                 # React Router setup and ProtectedRoute wrapping
        ├── index.css              # Global Design System (CSS Tokens, Glassmorphism classes)
        │
        ├── context/
        │   └── AuthContext.js     # React Context API for global authentication state management
        │
        ├── Components/
        │   ├── Navbar.js          # Glassmorphism Navigation Bar for subpages
        │   ├── homenavbar.js      # Glassmorphism Navigation Bar with Search functionality
        │   └── ProtectedRoute.js  # Wrapper component to restrict access to authenticated users
        │
        └── pages/                 # React Route Components and Modular CSS
            ├── home.js / home.module.css
            ├── login.js / login.module.css
            ├── Signup.js / SignUp.module.css
            ├── Product.js / product.module.css
            ├── Cart.js / Cart.module.css
            ├── Orders.js / Orders.module.css
            ├── Profile.js / Profile.module.css
            ├── Sell.js / Sell.module.css
            ├── DeliverItems.js / DeliverItems.module.css
            └── chatbot.js / chatbot.module.css
```

---

## 🚀 Deployment Guide

This project is fully configured for deployment.

Deployed on: 
Backend: https://buy-sell-rent-iiith-1.onrender.com
Frontend: https://dreamy-chebakia-b6174d.netlify.app
