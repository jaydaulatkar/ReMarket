# 📋 Pre-Deployment Checklist

Complete this checklist before pushing to GitHub and deploying on Render.

---

## ✅ Code Quality

- [ ] No console.log statements in production code
- [ ] No hardcoded URLs (use environment variables)
- [ ] No passwords/secrets in code
- [ ] No debugging code left in
- [ ] All imports are correct
- [ ] No unused imports or variables
- [ ] Error handling in place

---

## ✅ Backend Preparation

- [ ] `Backend/.env` has all required variables
- [ ] `Backend/.env` is in `.gitignore` (not tracked)
- [ ] `Backend/.env.example` created as template
- [ ] MongoDB connection tested locally
- [ ] All API endpoints tested locally
- [ ] CORS configured for production domains
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] `npm install` works without errors
- [ ] `npm start` works locally
- [ ] No console errors on startup

---

## ✅ Frontend Preparation

- [ ] Frontend API URL set correctly (localhost:5000)
- [ ] `.env.example` or `.env.production` created
- [ ] No hardcoded API URLs
- [ ] `npm install` works without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` works locally
- [ ] No console errors in browser
- [ ] No TypeScript/ESLint errors

---

## ✅ Database & Auth

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with correct permissions
- [ ] IP whitelist configured (allow 0.0.0.0/0 for Render)
- [ ] Connection string copied correctly
- [ ] Test user account created locally
- [ ] Test listing created locally
- [ ] Test inquiry sent locally

---

## ✅ Git & GitHub

- [ ] `.gitignore` includes:
  - `node_modules/`
  - `.env`
  - `.env.local`
  - `dist/`
  - `uploads/`
  - `.DS_Store`
  - `*.log`
- [ ] `Backend/.gitignore` properly configured
- [ ] `Frontend/.gitignore` properly configured
- [ ] GitHub repository created
- [ ] README.md explains project
- [ ] RENDER_DEPLOYMENT_GUIDE.md added
- [ ] QUICK_DEPLOY.md added
- [ ] Initial commit message is clear
- [ ] Branch is `main`

---

## ✅ Documentation

- [ ] README.md complete with:
  - Installation steps
  - Running instructions
  - API documentation
  - Features list
- [ ] RENDER_DEPLOYMENT_GUIDE.md complete
- [ ] QUICK_DEPLOY.md complete
- [ ] Comments on complex functions
- [ ] No outdated documentation

---

## ✅ Security

- [ ] No sensitive data in `.env.example`
- [ ] `.env` never committed to GitHub
- [ ] JWT_SECRET is random and strong
- [ ] Password hashing enabled
- [ ] CORS configured for allowed domains only
- [ ] No API keys exposed in frontend
- [ ] No credentials in comments
- [ ] Rate limiting considered (optional)

---

## ✅ Performance

- [ ] Images optimized (not too large)
- [ ] No unnecessary console.logs
- [ ] Database queries optimized
- [ ] Frontend build optimized (`npm run build`)
- [ ] CSS bundled properly
- [ ] Assets minified

---

## ✅ Testing (Local)

Run locally and verify:

### Authentication
- [ ] Register new user works
- [ ] Login works
- [ ] JWT token generated
- [ ] Token stored in localStorage
- [ ] Profile page loads after login
- [ ] Logout clears token

### Listings
- [ ] Create listing works
- [ ] Browse listings shows results
- [ ] Filter by category works
- [ ] Search by keyword works
- [ ] Sort options work
- [ ] Pagination works
- [ ] View count increments
- [ ] Edit listing works
- [ ] Delete listing works

### Archive & Re-list
- [ ] Archive listing works
- [ ] Archived listing hidden from browse
- [ ] Re-list archived listing works
- [ ] Views reset on re-list

### Inquiries
- [ ] Send inquiry works
- [ ] Received inquiries show for seller
- [ ] Sent inquiries show for buyer
- [ ] Seller dashboard shows metrics

### Dashboard
- [ ] Dashboard loads for seller
- [ ] Correct metrics displayed
- [ ] View count accurate
- [ ] Inquiry count accurate

---

## ✅ Final Steps Before Push

```bash
# 1. Verify no uncommitted changes
git status

# 2. Add all files
git add .

# 3. Create meaningful commit
git commit -m "Ready for Render deployment"

# 4. Push to GitHub
git push origin main
```

---

## ✅ Render Deployment

Once all above checked:

1. [ ] Go to render.com
2. [ ] Create Backend Web Service
3. [ ] Set environment variables
4. [ ] Deploy backend
5. [ ] Copy backend URL
6. [ ] Create Frontend Static Site
7. [ ] Set `VITE_API_URL` environment variable
8. [ ] Deploy frontend
9. [ ] Test both services
10. [ ] Verify auto-deploy works

---

## 🔍 Things to Double-Check

- [ ] `MONGO_URI` is correct
- [ ] `JWT_SECRET` is set and strong
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend CORS includes frontend URL
- [ ] All npm packages installed
- [ ] No syntax errors
- [ ] No console errors locally
- [ ] Database connection works
- [ ] All routes respond correctly

---

## 📝 Common Issues & Fixes

**Issue:** Backend won't connect to MongoDB
- [ ] Check MONGO_URI format
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Verify database user credentials

**Issue:** Frontend can't connect to backend
- [ ] Check VITE_API_URL environment variable
- [ ] Verify backend is deployed
- [ ] Check CORS configuration
- [ ] Check browser console for errors

**Issue:** Build fails on Render
- [ ] Check build command is correct
- [ ] Verify all dependencies in package.json
- [ ] Test build locally: `npm run build`
- [ ] Check for syntax errors

---

## 🎯 Pre-Deployment Sign-Off

- [ ] All checklist items completed
- [ ] Code tested locally
- [ ] Ready to push to GitHub
- [ ] Ready to deploy on Render

**You're ready to deploy! 🚀**

---

Print this checklist and check items off as you go!
