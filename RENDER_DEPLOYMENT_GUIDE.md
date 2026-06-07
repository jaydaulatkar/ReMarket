# 🚀 Render Deployment Guide

Complete step-by-step guide to deploy ReMarket on Render.

---

## 📋 Pre-Deployment Checklist

- ✅ Code committed to GitHub
- ✅ Backend `.env` configured
- ✅ Frontend API URL set
- ✅ MongoDB Atlas cluster created
- ✅ Both servers tested locally

---

## Step 1: Push to GitHub

### Initialize Git Repository (if not done)
```bash
cd C:\Users\Deepak Pandey\Desktop\jay\My-Marketplace

git init
git add .
git commit -m "Initial commit: ReMarket marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/My-Marketplace.git
git push -u origin main
```

### Push Updates (if already initialized)
```bash
git add .
git commit -m "Deployment configuration"
git push origin main
```

---

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

---

## Step 3: Deploy Backend API

### 3.1 Create New Web Service

1. **Dashboard** → Click **New +** → Select **Web Service**
2. **Connect Repository** → Select `My-Marketplace`
3. Fill in details:
   - **Name:** `remarket-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd Backend && npm install`
   - **Start Command:** `cd Backend && npm start`
   - **Region:** Choose closest to you
   - **Plan:** Free tier (or Starter $7/month for better uptime)

### 3.2 Set Environment Variables

Go to **Settings** → **Environment** → Add variables:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/remarket
JWT_SECRET=your-very-secret-key-min-32-characters-long
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password
```

**Important:** Make sure MONGO_URI matches your MongoDB Atlas cluster!

### 3.3 Deploy
- Click **Create Web Service**
- Wait for deployment (takes 2-5 minutes)
- Once deployed, you'll get a URL like: `https://remarket-backend.onrender.com`
- **Copy this URL - you'll need it for Frontend**

---

## Step 4: Update Frontend for Production

### 4.1 Update API Configuration

Edit `Frontend/src/utils/api.js`:

```javascript
// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 Create `.env.production` (Optional but Recommended)

Create `Frontend/.env.production`:

```
VITE_API_URL=https://remarket-backend.onrender.com
```

### 4.3 Update vite.config.js

Edit `Frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

---

## Step 5: Deploy Frontend

### 5.1 Create New Static Site

1. **Dashboard** → Click **New +** → Select **Static Site**
2. **Connect Repository** → Select `My-Marketplace`
3. Fill in details:
   - **Name:** `remarket-frontend`
   - **Branch:** `main`
   - **Build Command:** `cd Frontend && npm install && npm run build`
   - **Publish directory:** `Frontend/dist`
   - **Region:** Same as Backend (recommended)

### 5.2 Add Environment Variables

Go to **Settings** → **Environment** → Add:

```
VITE_API_URL=https://remarket-backend.onrender.com
```

Replace with your actual Backend URL from Step 3.

### 5.3 Deploy
- Click **Create Static Site**
- Wait for deployment (takes 2-5 minutes)
- You'll get a URL like: `https://remarket-frontend.onrender.com`

---

## Step 6: Configure CORS on Backend

Update `Backend/server.js` to allow your frontend URL:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://remarket-frontend.onrender.com', // Add your Render frontend URL
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
```

Then push this change:
```bash
git add Backend/server.js
git commit -m "Configure CORS for Render deployment"
git push origin main
```

---

## Step 7: Test the Deployment

### 7.1 Test Backend
Go to:
```
https://remarket-backend.onrender.com
```

You should see:
```json
{
  "message": "Marketplace API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 7.2 Test Frontend
Go to:
```
https://remarket-frontend.onrender.com
```

You should see the ReMarket homepage.

### 7.3 Test Full Workflow
1. Register a new account
2. Create a listing
3. Browse listings
4. Send an inquiry

---

## Step 8: Update Database Connection (If Needed)

If MongoDB is slow or not responding:

1. Go to MongoDB Atlas
2. **Network Access** → Check IP whitelist
3. Add Render IP: Click **Allow access from anywhere** (temporary) or add Render's IP
4. **Database Access** → Verify user credentials

---

## Important Configuration Files

### Backend/server.js (Production Ready)
Already configured with:
- ✅ CORS enabled
- ✅ Error handling
- ✅ MongoDB connection
- ✅ JWT authentication
- ✅ Environment variables

### Frontend/vite.config.js (Production Ready)
Already configured with:
- ✅ React plugin
- ✅ Build optimization
- ✅ Sourcemap disabled
- ✅ Minification enabled

---

## Environment Variables Summary

### Backend (Render)
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/remarket
JWT_SECRET=your-secret-key-min-32-chars
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

### Frontend (Render)
```
VITE_API_URL=https://remarket-backend.onrender.com
```

---

## Continuous Deployment (Auto-Deploy on Push)

By default, Render **auto-deploys** when you push to GitHub:

1. Make code changes locally
2. Commit and push to GitHub
3. Render automatically detects changes
4. Backend auto-rebuilds & deploys
5. Frontend auto-rebuilds & deploys
6. Usually takes 2-5 minutes

To disable auto-deploy:
- Go to **Settings** → Toggle **Auto-Deploy**

---

## Troubleshooting

### Frontend Shows "Cannot Connect to API"
**Problem:** Frontend can't reach backend
**Solution:**
1. Check `VITE_API_URL` environment variable on Render
2. Verify backend URL is correct
3. Check CORS settings in `Backend/server.js`
4. Restart both services

### Backend Connection to MongoDB Fails
**Problem:** MongoDB connection error
**Solution:**
1. Check `MONGO_URI` in environment variables
2. Verify IP whitelist in MongoDB Atlas (Network Access)
3. Check database user credentials
4. Test connection locally first

### "Free Tier Instance Spinning Down"
**Problem:** Backend goes to sleep after 15 minutes of inactivity
**Solution:** 
- Upgrade to Starter plan ($7/month) for continuous uptime
- Use a monitoring service (UptimeRobot) to ping regularly

### Build Fails on Render
**Problem:** Deployment says "Build failed"
**Solution:**
1. Check build logs in Render dashboard
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Check for syntax errors

---

## Monitoring & Logs

### View Logs
1. Go to your service on Render
2. Click **Logs** tab
3. See real-time logs

### Monitor Performance
1. Click **Metrics** tab
2. View CPU, memory, requests
3. Check for errors/warnings

---

## Custom Domain (Optional)

### Add Custom Domain to Frontend
1. Go to Frontend service
2. **Settings** → **Custom Domains** → Add domain
3. Configure DNS with your domain provider

### Add Custom Domain to Backend
1. Go to Backend service
2. **Settings** → **Custom Domains** → Add domain
3. Update Frontend `VITE_API_URL` to custom domain

---

## Final Checklist

- ✅ Backend deployed and responding
- ✅ Frontend deployed and loading
- ✅ CORS configured correctly
- ✅ MongoDB Atlas IP whitelist updated
- ✅ Environment variables set
- ✅ Tested registration & login
- ✅ Tested create listing
- ✅ Tested browse & search
- ✅ Tested inquiries

---

## Production URLs

Once deployed, share these URLs:

**Frontend:** `https://remarket-frontend.onrender.com`  
**Backend API:** `https://remarket-backend.onrender.com`

---

## Cost Breakdown (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| **Backend** | Starter | $7 |
| **Frontend** | Free | $0 |
| **MongoDB Atlas** | Free | $0 |
| **Total** | | **$7/month** |

Or all free if you use Free tier for Backend (with cold starts).

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy Backend on Render
3. ✅ Deploy Frontend on Render
4. ✅ Test all features
5. ✅ Monitor logs for errors
6. ✅ Share deployment URLs

**Your marketplace is now live! 🎉**
