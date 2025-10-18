# 🌐 MongoDB Atlas Setup Guide (For Hackathons)

## Why Use Atlas for Hackathons?

✅ Team collaboration  
✅ Easy deployment  
✅ Demo-ready  
✅ Professional  
✅ Free tier (512MB)  

---

## 🚀 Step-by-Step Setup (15 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email: Your email
   - Or: Sign in with Google (faster!)
3. Choose: **FREE M0 tier** (512MB - perfect for hackathons)

---

### Step 2: Create a Cluster

1. **Choose Cloud Provider:**
   - AWS (recommended)
   - Region: Choose closest to your hackathon location
   - Cluster Tier: **M0 Sandbox (FREE)**

2. **Cluster Name:** 
   - Name it: `resqueaid-hackathon` or keep default

3. **Click:** "Create Deployment"

⏳ Wait 3-5 minutes for cluster to deploy...

---

### Step 3: Create Database User

1. **Security Quickstart** will appear
2. **Username:** `resqueaid_user` (or any name)
3. **Password:** Click "Autogenerate Secure Password"
   - **IMPORTANT:** Copy and save this password!
4. **Click:** "Create User"

---

### Step 4: Whitelist IP Addresses

1. **Where would you like to connect from?**
2. **For Hackathons, choose:**
   - **Option A:** "Add My Current IP Address" (if stable WiFi)
   - **Option B:** "Allow Access from Anywhere" (0.0.0.0/0) ← **RECOMMENDED for hackathons**

3. **Why "Anywhere"?**
   - Works on any WiFi network
   - Works during demos
   - Works when teammates connect
   - Easier for hackathon chaos!

4. **Click:** "Finish and Close"

---

### Step 5: Get Connection String

1. **Click:** "Connect" button on your cluster
2. **Choose:** "Connect your application"
3. **Driver:** Node.js
4. **Version:** 5.5 or later
5. **Copy the connection string:**

```
mongodb+srv://resqueaid_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Replace `<password>`** with your actual password!

---

### Step 6: Create Database

1. **Click:** "Browse Collections"
2. **Click:** "+ Create Database"
3. **Database Name:** `resqueaid`
4. **Collection Name:** `users`
5. **Click:** "Create"

---

### Step 7: Update Your App

**Update `.env` file:**

```bash
# OLD (Local)
MONGODB_URI=mongodb://localhost:27017/resqueaid

# NEW (Atlas) - Replace with YOUR connection string
MONGODB_URI=mongodb+srv://resqueaid_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/resqueaid?retryWrites=true&w=majority

JWT_SECRET=resqueaid_super_secret_key_change_in_production_2025
PORT=5001
NODE_ENV=development
```

**IMPORTANT:** 
- Replace `YOUR_PASSWORD_HERE` with your actual password
- Add `/resqueaid` before the `?` to specify database name

---

### Step 8: Migrate Your Existing Data (Optional)

If you want to keep your existing user (Sam):

**Export from local:**
```bash
mongoexport --db=resqueaid --collection=users --out=users.json --jsonArray
```

**Import to Atlas:**
```bash
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/resqueaid" --collection=users --file=users.json --jsonArray
```

Or just start fresh and signup again! (Easier for hackathons)

---

### Step 9: Test Connection

**Restart your backend:**
```bash
cd /Applications/Resqueaid
npm run dev
```

**Look for:**
```
🚀 Server is running on port 5001
✅ MongoDB Connected Successfully
```

**If you see this, YOU'RE CONNECTED TO ATLAS!** 🎉

---

## 🔍 How to View Your Atlas Data

### Method 1: Atlas Web Interface (Easiest!)

1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click: "Browse Collections"
4. Navigate: resqueaid → users
5. See your data in the web interface! 📊

### Method 2: MongoDB Compass

1. Open MongoDB Compass
2. Click: "New Connection"
3. Paste your Atlas connection string
4. Click: "Connect"
5. Navigate to resqueaid → users

### Method 3: Command Line

```bash
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/resqueaid" --username resqueaid_user
```

---

## 👥 Share with Your Team

**Give your teammates:**
1. The connection string (with password)
2. They update their `.env` file
3. Everyone now shares the same database! 🎊

**Team Collaboration:**
```
You register → Data in Atlas
Teammate logs in → Uses same Atlas data
Deploy to Heroku → Uses same Atlas data
Demo to judges → Uses same Atlas data
```

---

## 🚀 Deployment (When Ready)

### Heroku:
```bash
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/resqueaid"
```

### Vercel:
Add environment variable in dashboard:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resqueaid
```

### Render:
Add environment variable:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resqueaid
```

**That's it!** App deployed with database! ✨

---

## 🔐 Security Best Practices

### For Hackathons (Quick & Dirty):
- ✅ Allow access from anywhere (0.0.0.0/0)
- ✅ Share credentials with team in Slack/Discord
- ✅ Use simple password

### After Hackathon (Production):
- 🔒 Restrict IP addresses to specific locations
- 🔒 Use environment variables (never commit .env)
- 🔒 Enable 2FA on Atlas account
- 🔒 Rotate passwords
- 🔒 Set up monitoring and alerts

---

## 💰 Pricing

**Free Tier (M0):**
- ✅ 512MB storage (enough for 1000s of users)
- ✅ Shared RAM
- ✅ Shared CPU
- ✅ Perfect for hackathons!
- ✅ Free forever

**Will you run out?**
- Each user = ~500 bytes
- 512MB = 1,000,000 users
- You're fine! 😄

---

## 🆘 Troubleshooting

### "MongoServerError: bad auth"
- Check password is correct (no spaces)
- Password might need URL encoding for special characters

### "MongoServerError: IP not whitelisted"
- Go to Atlas → Network Access
- Add current IP or use 0.0.0.0/0

### "Connection timeout"
- Check internet connection
- Check WiFi allows MongoDB ports
- Try different network

### "Can't connect to cluster"
- Wait 3-5 minutes for cluster to fully deploy
- Refresh Atlas dashboard

---

## 📊 Comparison: Local vs Atlas

| Feature | Local MongoDB | MongoDB Atlas |
|---------|--------------|---------------|
| **Speed** | Fastest | Fast enough |
| **Setup** | 2 minutes | 15 minutes |
| **Team Access** | ❌ No | ✅ Yes |
| **Deployment** | ❌ Doesn't work | ✅ Works |
| **Demo Ready** | ❌ No | ✅ Yes |
| **Cost** | Free | Free |
| **Hackathon Ready** | ❌ | ✅ |

---

## 🎯 Hackathon Pro Tips

1. **Setup Atlas First** - Do it before coding starts
2. **Share Credentials** - Use team Slack/Discord
3. **Test Early** - Make sure everyone can connect
4. **Backup Connection String** - Save in multiple places
5. **Monitor Usage** - Check Atlas dashboard occasionally
6. **Deploy Early** - Deploy to production early to catch issues
7. **Demo Data** - Add some test data for impressive demo

---

## ✅ Checklist

- [ ] Created Atlas account
- [ ] Created M0 free cluster
- [ ] Created database user
- [ ] Whitelisted IP (0.0.0.0/0 for hackathons)
- [ ] Got connection string
- [ ] Updated .env file
- [ ] Tested backend connection
- [ ] Shared credentials with team
- [ ] Tested signup/login
- [ ] Data visible in Atlas dashboard

---

## 🏆 Why This Matters for Judging

**Judges LOVE seeing:**
- ✅ Cloud database (shows production knowledge)
- ✅ Working demo from any device
- ✅ Professional deployment
- ✅ Team collaboration setup

**Judges DON'T like:**
- ❌ "It only works on my laptop"
- ❌ "We need to set up MongoDB first"
- ❌ Localhost-only demos
- ❌ "Our database is down"

---

**Ready to switch to Atlas?** Follow Step 1 above! 🚀

**Questions?** Check the troubleshooting section or ask!

