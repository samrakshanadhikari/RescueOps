# 🚀 Quick Start: Google Maps Integration

## ⚡ **5-Minute Setup**

### **Step 1: Get API Key** (2 minutes)
```
1. Go to: https://console.cloud.google.com/
2. Create project or select existing
3. Enable: "Places API (New)"
4. Create API Key
5. Copy your key
```

### **Step 2: Add to .env** (1 minute)
```bash
# Open: /Applications/Resqueaid/.env
# Add this line:
GOOGLE_MAPS_API_KEY=paste_your_key_here
```

### **Step 3: Restart Backend** (1 minute)
```bash
# The backend should auto-restart
# Or manually:
cd /Applications/Resqueaid
pkill -f "node backend/server.js"
node backend/server.js
```

### **Step 4: Test** (1 minute)
```
1. Open: http://localhost:3000
2. Login
3. Type: "I need shelter tonight"
4. Submit
5. See map with nearest shelter!
```

---

## ✅ **What You Get:**

- 🗺️ **Google Maps** showing nearest location
- 📍 **Auto-updates** every 3 seconds
- 🧭 **Navigation** instructions ("Make your way to location showing above")
- 📱 **"Open in Google Maps"** button for directions
- 🎨 **Beautiful UI** with animations

---

## 🎯 **Classification → Location Type:**

| Request | Shows |
|---------|-------|
| "Need shelter" | Nearest community shelter |
| "Need doctor" | Nearest urgent care clinic |
| "Need police" | Nearest police station |

---

## 📁 **Key Files:**

```
Backend:
/backend/controllers/mapController.js
/backend/routes/mapRoutes.js
/backend/server.js (updated)

Frontend:
/frontend/src/components/ResultsPage.js (updated)
/frontend/src/services/api.js (updated)
/frontend/src/App.css (updated)

Environment:
/.env (ADD YOUR API KEY HERE!)
```

---

## 🐛 **Troubleshooting:**

**Map not showing?**
- Check `.env` has `GOOGLE_MAPS_API_KEY`
- Enable "Places API (New)" in Google Cloud
- Restart backend server

**"No location found"?**
- Increase search radius (5km → 10km)
- Check if area has relevant places
- Try different classification

**Backend crashed?**
- Run: `cd backend && npm install axios`
- Restart: `node backend/server.js`

---

## 💡 **Demo Tips:**

1. Use a **shelter request** first (most dramatic)
2. Show the **3-second auto-update**
3. Click **"Open in Google Maps"**
4. Mention **AI classification** (Gemini)
5. Highlight **mobile support**

---

## 📚 **Full Documentation:**

- **Complete Guide:** `GOOGLE_MAPS_INTEGRATION_GUIDE.md`
- **Setup Summary:** `MAPS_SETUP_COMPLETE.md`
- **This File:** `QUICK_START_MAPS.md`

---

## ✨ **You're Done!**

**Just add your API key and test!** 🚀

**Total Time: ~5 minutes** ⏱️

**Questions? Check the full guide!** 📖

