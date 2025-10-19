# 🚀 DisAID - Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud Account**: https://console.cloud.google.com
2. **Google Cloud SDK**: Install gcloud CLI
3. **MongoDB Atlas**: Your database connection string
4. **Gemini API Key**: Your Google AI API key

---

## 📦 **Option 1: Deploy Backend to Google App Engine** (Easiest)

### Step 1: Install Google Cloud SDK

```bash
# macOS (Homebrew)
brew install --cask google-cloud-sdk

# Or download from:
# https://cloud.google.com/sdk/docs/install
```

### Step 2: Initialize gcloud

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create disaid-app --name="DisAID"

# Set project
gcloud config set project disaid-app

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 3: Set Environment Variables

**Option A: Using Secret Manager (Recommended)**

```bash
# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Add MongoDB URI
echo -n "your_mongodb_atlas_connection_string" | \
  gcloud secrets create MONGODB_URI --data-file=-

# Add JWT Secret
echo -n "your_jwt_secret" | \
  gcloud secrets create JWT_SECRET --data-file=-

# Add Gemini API Key
echo -n "your_gemini_api_key" | \
  gcloud secrets create GEMINI_API_KEY --data-file=-
```

**Option B: Edit app.yaml directly** (Less secure)

Edit `app.yaml` and add your credentials under `env_variables`.

### Step 4: Deploy Backend

```bash
# From project root
gcloud app deploy

# Note the deployed URL, e.g., https://disaid-app.uc.r.appspot.com
```

---

## 🌐 **Option 2: Deploy Frontend to Firebase Hosting**

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase

```bash
firebase login
firebase init hosting

# Select:
# - Use an existing project or create new
# - Public directory: frontend/build
# - Single-page app: Yes
# - GitHub deployment: No (for now)
```

### Step 3: Update Frontend API URL

Edit `frontend/.env`:

```bash
REACT_APP_API_URL=https://your-backend-url.appspot.com/api
```

### Step 4: Build and Deploy Frontend

```bash
# Build frontend
cd frontend
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 🐳 **Option 3: Deploy to Google Cloud Run** (Docker-based)

### Backend Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY backend ./backend

EXPOSE 8080

CMD ["node", "backend/server.js"]
```

### Deploy to Cloud Run

```bash
# Build and deploy backend
gcloud run deploy disaid-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production

# Deploy frontend
cd frontend
npm run build
gcloud run deploy disaid-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔒 **Security: Using Secret Manager**

### Access Secrets in Code

Update `backend/server.js`:

```javascript
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

// Use in server.js
const MONGODB_URI = process.env.MONGODB_URI || await getSecret('MONGODB_URI');
```

---

## 📊 **Deployment Checklist**

### Before Deployment:

- [ ] MongoDB Atlas connection string ready
- [ ] Gemini API key obtained
- [ ] JWT secret generated
- [ ] Google Cloud project created
- [ ] Billing enabled on Google Cloud
- [ ] gcloud CLI installed and authenticated

### Backend Deployment:

- [ ] `app.yaml` configured
- [ ] Environment variables set (Secret Manager)
- [ ] Backend tested locally
- [ ] Deploy with `gcloud app deploy`
- [ ] Test API endpoints

### Frontend Deployment:

- [ ] Backend URL updated in frontend `.env`
- [ ] Build successful (`npm run build`)
- [ ] Firebase initialized
- [ ] Deploy with `firebase deploy`
- [ ] Test full application flow

---

## 🧪 **Testing Deployment**

```bash
# Test backend
curl https://your-backend-url.appspot.com/api

# Test frontend
open https://your-app.web.app
```

---

## 💰 **Cost Estimation**

### Free Tier (Suitable for hackathon):
- **App Engine**: F1 instance, 28 hrs/day free
- **Firebase Hosting**: 10GB storage, 360MB/day transfer free
- **Cloud Run**: 2 million requests/month free
- **MongoDB Atlas**: M0 cluster free tier (512MB)

**Expected monthly cost during development: $0-5**

---

## 🔧 **Environment Variables Needed**

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/disaid
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
PORT=8080
NODE_ENV=production
```

---

## 🆘 **Troubleshooting**

### Issue: "gcloud: command not found"
```bash
# Install gcloud SDK
brew install --cask google-cloud-sdk
```

### Issue: Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend can't connect to backend
- Check CORS settings in backend
- Verify API URL in frontend .env
- Check backend is deployed and running

---

## 📚 **Useful Commands**

```bash
# View logs
gcloud app logs tail -s default

# View deployed versions
gcloud app versions list

# Open app in browser
gcloud app browse

# Delete a version
gcloud app versions delete VERSION_ID
```

---

## 🎉 **Next Steps After Deployment**

1. **Custom Domain**: Add your own domain
2. **SSL Certificate**: Automatic with App Engine/Firebase
3. **Monitoring**: Set up Cloud Monitoring
4. **CI/CD**: Set up GitHub Actions for auto-deployment

---

## 🔗 **Useful Links**

- [Google Cloud Console](https://console.cloud.google.com)
- [App Engine Docs](https://cloud.google.com/appengine/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Cloud Run Docs](https://cloud.google.com/run/docs)

---

**Your DisAID app will be live on Google Cloud!** 🚀

