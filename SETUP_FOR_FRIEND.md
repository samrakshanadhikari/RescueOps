# 🚀 DisAID - Setup Instructions

Welcome! This is a disaster relief AI application that helps classify emergency requests and finds nearby assistance.

---

## 📋 What You'll Need

1. **Node.js** (v14 or higher) - Download from: https://nodejs.org/
2. **Gemini API Key** (FREE) - Get from: https://makersuite.google.com/app/apikey
3. **A code editor** - VSCode recommended: https://code.visualstudio.com/

---

## 🔧 Setup Steps

### Step 1: Install Dependencies

Open terminal and navigate to the project folder, then run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend Configuration:**

Create a file: `backend/.env` with this content:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret (you can change this to any random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Gemini AI API Key (REQUIRED)
# Get yours at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Google Maps API Key (Optional - works without it!)
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

**Frontend Configuration:**

Create a file: `frontend/.env` with this content:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Step 3: Get Your Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste it in `backend/.env` replacing `YOUR_GEMINI_API_KEY_HERE`

### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
node serverSQLite.js
```

You should see:
```
✅ SQLite Database Connected Successfully
🚀 Server is running on port 5001
💾 Database: SQLite (disaid.db)
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Your browser should automatically open to: http://localhost:3000

---

## 🎯 How to Use the App

1. **Register/Login** on the homepage
2. **Submit a help request** like:
   - "I need medical help urgently"
   - "Looking for temporary shelter"
   - "Need to file a police report"
3. **Watch the magic:**
   - AI classifies your request (emergency vs non-emergency)
   - Gets your GPS location
   - Shows nearby facilities on Google Maps
   - Automatically opens navigation
   - Displays real organizations with contact info

---

## 🗺️ Features

✅ **AI-Powered Classification** - Uses Google Gemini AI  
✅ **Emergency Detection** - Routes urgent cases immediately  
✅ **GPS Location Services** - Browser-based geolocation  
✅ **Google Maps Integration** - Embedded maps + navigation  
✅ **Real Organization Data** - Suggests actual nearby facilities  
✅ **SQLite Database** - Works on any network, no cloud needed!  

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill processes on port 5001
lsof -ti:5001 | xargs kill -9

# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9
```

### Google Maps Not Showing?
1. Check browser console (F12) for errors
2. Allow location access when prompted
3. Disable VPN for accurate GPS
4. Try manual location override (see console logs)

### Gemini API Not Working?
1. Make sure you added your API key to `backend/.env`
2. Check the key is valid at: https://makersuite.google.com/app/apikey
3. Verify no extra spaces in the `.env` file

### Frontend Can't Connect to Backend?
1. Make sure backend is running on port 5001
2. Check `frontend/.env` has: `REACT_APP_API_URL=http://localhost:5001/api`
3. Restart the frontend after changing `.env`

---

## 📁 Project Structure

```
Resqueaid/
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── geminiController.js   # AI classification
│   │   └── mapController.js      # Location services
│   ├── routes/             # API endpoints
│   ├── models/             # Database models (SQLite)
│   ├── middleware/         # Auth & validation
│   ├── database/           # SQLite setup
│   ├── serverSQLite.js     # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── HelpRequest.js    # Request submission
│   │   │   ├── ResultsPage.js    # Non-emergency results
│   │   │   └── EmergencyPage.js  # Emergency page
│   │   ├── services/       # API calls
│   │   └── App.js          # Main app
│   └── package.json
└── README.md
```

---

## 🚀 Tech Stack

**Backend:**
- Node.js + Express
- SQLite (database)
- Google Gemini AI (classification)
- OpenStreetMap (geocoding)
- JWT (authentication)

**Frontend:**
- React.js
- React Router
- Axios
- Google Maps (embed)

**All FREE APIs:**
- ✅ Gemini AI (free tier)
- ✅ OpenStreetMap Nominatim (free)
- ✅ Google Maps embed (no API key needed)
- ✅ Browser Geolocation (built-in)

---

## 💡 Tips for Demo/Hackathon

1. **Test Emergency Flow:**
   - Use words like "urgent", "emergency", "immediately"
   - Should route to emergency page with call simulation

2. **Test Non-Emergency Flow:**
   - Use phrases like "I need help with...", "looking for..."
   - Should show map and nearby locations

3. **Location Override (if GPS is wrong):**
   Open browser console and run:
   ```javascript
   localStorage.setItem("userLocation", JSON.stringify({
     latitude: 30.2672,  // Austin, TX
     longitude: -97.7431
   }));
   location.reload();
   ```

4. **Cool Features to Highlight:**
   - Real-time AI classification
   - Automatic emergency detection
   - GPS-based location services
   - Auto-opens Google Maps navigation
   - Suggests real nearby organizations
   - Works offline (SQLite database)

---

## 📞 Emergency Phone Numbers Feature

The app provides context-specific emergency numbers:
- Medical emergencies: 911, Poison Control (1-800-222-1222), etc.
- Shelter emergencies: 911, FEMA (1-800-621-3362), etc.
- Police emergencies: 911, Human Trafficking Hotline, etc.

All numbers are clickable (tel: links) for easy dialing on mobile!

---

## 🎉 You're Ready!

Your app should now be running at: **http://localhost:3000**

If you have any issues, check the troubleshooting section above or look for error messages in the terminal or browser console (F12).

---

## 📝 Notes

- **No credit card needed** - All APIs are free tier
- **Works on any network** - SQLite database is local
- **No MongoDB required** - Using SQLite for simplicity
- **Production-ready UX** - Professional Google Maps integration

Enjoy exploring the app! 🚀


