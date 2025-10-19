# 🚀 DisAID - Deployment Guide

This guide covers multiple deployment options for your DisAID application.

---

## 🏆 Option 1: Render.com (RECOMMENDED)

**Best for:** SQLite apps, free tier, easy setup

### Step-by-Step Deployment:

#### 1. Create Render Account
- Go to: https://render.com/
- Sign up with your GitHub account

#### 2. Deploy Backend (API)

**Manual Setup:**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `RescueOps`
3. Configure:
   - **Name:** `disaid-backend`
   - **Region:** Oregon (Free)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node serverSQLite.js`
   - **Plan:** Free

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=your-random-secret-key-here-make-it-long
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Enable Persistent Disk (IMPORTANT for SQLite):**
   - Scroll to "Disk"
   - Click "Add Disk"
   - Name: `sqlite-data`
   - Mount Path: `/var/data`
   - Size: 1 GB (free)

6. Click "Create Web Service"

**Your backend will be at:** `https://disaid-backend.onrender.com`

#### 3. Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your repository: `RescueOps`
3. Configure:
   - **Name:** `disaid-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

4. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=https://disaid-backend.onrender.com/api
   ```

5. Click "Create Static Site"

**Your app will be at:** `https://disaid-frontend.onrender.com`

#### 4. Update Backend CORS

Update `backend/serverSQLite.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://disaid-frontend.onrender.com'
  ]
}));
```

Commit and push - Render will auto-deploy!

---

## 🌐 Option 2: Vercel (Frontend) + Render (Backend)

**Best for:** Lightning-fast frontend

### Backend on Render
Follow steps from Option 1 above for backend.

### Frontend on Vercel

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import `RescueOps` repository
5. Configure:
   - **Framework:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

6. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://disaid-backend.onrender.com/api
   ```

7. Click "Deploy"

**Your app will be at:** `https://your-app.vercel.app`

---

## 🐳 Option 3: Docker + Any Cloud Provider

### Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create directory for SQLite database
RUN mkdir -p /var/data

EXPOSE 5001

CMD ["node", "serverSQLite.js"]
```

### Create Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deploy to:
- **Railway.app** (easiest Docker deployment)
- **Fly.io** (global edge deployment)
- **DigitalOcean App Platform**
- **AWS ECS**
- **Google Cloud Run**

---

## 🚂 Option 4: Railway.app

**Best for:** Quick deployment with CLI

### Deploy Backend:

1. Go to: https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `RescueOps`
5. Click "Add variables":
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=your-secret-key
   GEMINI_API_KEY=your-api-key
   ```

6. **Add Volume for SQLite:**
   - Go to "Data" tab
   - Click "New Volume"
   - Mount path: `/var/data`

7. **Settings:**
   - Root Directory: `backend`
   - Start Command: `node serverSQLite.js`

8. Click "Deploy"

### Deploy Frontend:

1. Create new project
2. Select repository
3. Root Directory: `frontend`
4. Environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app/api
   ```
5. Deploy!

---

## 📱 Option 5: Mobile-Ready Deployment

### For Production Mobile App:

If you want to make this a mobile app later:

1. **Deploy backend** on Render/Railway (steps above)
2. **Convert frontend to React Native**
3. Deploy on:
   - **iOS:** App Store (requires Apple Developer account - $99/year)
   - **Android:** Google Play Store (one-time $25 fee)
   - **PWA:** Progressive Web App (free, works on all platforms)

---

## 🔒 Security Checklist Before Deployment

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Verify `GEMINI_API_KEY` is added to environment variables
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Update CORS origins to include your deployed frontend URL
- [ ] Remove any console.log statements with sensitive data
- [ ] Add rate limiting (optional but recommended)
- [ ] Enable database backups (Render offers this in paid plans)

---

## 📊 Cost Comparison

| Platform | Backend | Frontend | Database | Total/Month |
|----------|---------|----------|----------|-------------|
| **Render** | Free | Free | Free (1GB) | **$0** |
| **Vercel + Render** | Free | Free | Free | **$0** |
| **Railway** | Free credits | Free credits | Free | **$0** (then $5+) |
| **Heroku** | $7 | Free | $9 (PostgreSQL) | **$16** |
| **AWS/GCP** | Variable | Variable | Variable | **$10-50+** |

---

## 🐛 Common Deployment Issues

### Issue 1: SQLite Database Not Persisting
**Solution:** Make sure you added a persistent disk/volume and updated the database path:

```javascript
// backend/database/sqlite.js
const path = require('path');
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/var/data/disaid.db'  // Production path (mounted disk)
  : path.join(__dirname, '../../disaid.db');  // Development path
```

### Issue 2: Frontend Can't Connect to Backend
**Solution:** 
1. Check `REACT_APP_API_URL` in frontend environment variables
2. Update CORS in backend to allow frontend domain
3. Make sure backend URL includes `/api` in the frontend

### Issue 3: Build Fails
**Solution:**
1. Check Node.js version (use v18+)
2. Make sure `package.json` is in correct directories
3. Verify all dependencies are in `package.json`, not just installed locally

### Issue 4: "Port Already in Use"
**Solution:** This shouldn't happen in production. Backend automatically uses `process.env.PORT`

---

## 🎯 Recommended Setup for Different Scenarios

### For Hackathons/Demos:
→ **Render.com** (fastest, free, reliable)

### For Portfolio/Resume:
→ **Vercel + Render** (Vercel is impressive on resume)

### For Scaling to Production:
→ **Railway** or **DigitalOcean** (easy to scale, reasonable pricing)

### For Learning Docker/DevOps:
→ **Railway with Docker** or **Fly.io**

### For Enterprise/Startup:
→ **AWS/GCP** with RDS (replace SQLite with PostgreSQL)

---

## 🚀 Quick Start: Deploy in 5 Minutes

**Fastest Path:**

1. **Push to GitHub** ✅ (Already done!)
2. **Create Render account** → https://render.com/
3. **Deploy backend:**
   - New Web Service → Connect repo
   - Add environment variables (JWT_SECRET, GEMINI_API_KEY)
   - Add persistent disk
4. **Deploy frontend:**
   - New Static Site → Connect repo
   - Add REACT_APP_API_URL
5. **Done!** 🎉

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app/

---

## 🎉 Next Steps After Deployment

1. **Custom Domain:** Connect your own domain (Render & Vercel support this)
2. **Analytics:** Add Google Analytics or Mixpanel
3. **Monitoring:** Set up error tracking (Sentry)
4. **Backups:** Enable automatic database backups
5. **CI/CD:** Already set up! Push to GitHub = auto-deploy 🚀

---

Made with 💚 for disaster relief. Deploy and help people in need!

