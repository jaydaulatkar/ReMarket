# ⚡ Quick Render Deployment Setup

## Before Deployment

### 1. Prepare Your Code
```bash
cd My-Marketplace
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/My-Marketplace.git
git push -u origin main
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Connect your GitHub account

---

## Deploy Backend

### Step 1: Create Web Service
1. Dashboard → **New +** → **Web Service**
2. Select your `My-Marketplace` repository
3. Fill form:
   - **Name:** `remarket-backend`
   - **Environment:** Node
   - **Build Command:** `cd Backend && npm install`
   - **Start Command:** `cd Backend && npm start`

### Step 2: Set Environment Variables
Click **Settings** → **Environment**, add:
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/remarket
JWT_SECRET=your-secret-key-32-chars-min
GMAIL_USER=your@email.com
GMAIL_PASSWORD=app-password
```

### Step 3: Deploy
- Click **Create Web Service**
- Wait 2-5 minutes
- **Copy the Backend URL** (like `https://remarket-backend.onrender.com`)

---

## Deploy Frontend

### Step 1: Create Static Site
1. Dashboard → **New +** → **Static Site**
2. Select your repository
3. Fill form:
   - **Name:** `remarket-frontend`
   - **Build Command:** `cd Frontend && npm install && npm run build`
   - **Publish directory:** `Frontend/dist`

### Step 2: Set Environment Variables
Click **Settings** → **Environment**, add:
```
VITE_API_URL=https://remarket-backend.onrender.com
```
(Replace with your actual Backend URL)

### Step 3: Deploy
- Click **Create Static Site**
- Wait 2-5 minutes
- Get your Frontend URL (like `https://remarket-frontend.onrender.com`)

---

## Post-Deployment

### Test Backend
```
https://remarket-backend.onrender.com
```
Should show JSON response.

### Test Frontend
```
https://remarket-frontend.onrender.com
```
Should show the marketplace homepage.

### Test Features
1. Register new account
2. Create listing
3. Browse listings
4. Send inquiry

---

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier)
3. Get connection string
4. **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Use connection string in `MONGO_URI`

---

## Auto-Deploy Setup

By default, Render auto-deploys when you push to GitHub:

1. Make code changes
2. `git add .`
3. `git commit -m "message"`
4. `git push origin main`
5. Render automatically deploys (2-5 min)

---

## Important Notes

- ✅ Free tier backend will sleep after 15 min inactivity
- ✅ Upgrade to Starter ($7/month) for always-on
- ✅ Frontend is always free
- ✅ MongoDB Atlas free tier is sufficient
- ✅ Total cost: $7/month (or free with cold starts)

---

## URLs After Deployment

**Frontend:** `https://remarket-frontend.onrender.com`
**Backend:** `https://remarket-backend.onrender.com`

Share these with users to access your marketplace!

---

For detailed guide, see: `RENDER_DEPLOYMENT_GUIDE.md`
