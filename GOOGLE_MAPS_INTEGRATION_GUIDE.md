# 🗺️ Google Maps Integration Guide

## ✅ **Integration Complete!**

Your DisAID app now displays the **nearest non-emergency location** on Google Maps based on the user's situation!

---

## 🎯 **What Was Implemented:**

### **Backend:**
1. ✅ **`mapController.js`** - Handles Google Places API requests
2. ✅ **`mapRoutes.js`** - API routes for location services
3. ✅ **`server.js`** - Registered map routes (`/api/map`)

### **Frontend:**
1. ✅ **`ResultsPage.js`** - Updated with dynamic Google Maps
2. ✅ **`api.js`** - Added `mapAPI.findNearby()` function
3. ✅ **`App.css`** - Added complete styling for map section

---

## 🗺️ **How It Works:**

### **1. User Submits Request**
```
User: "I need a place to stay for a few days"
↓
Gemini AI: non_emergency_shelter
↓
Routes to: ResultsPage with classification
```

### **2. Location Detection**
```javascript
// Automatically gets user's current location
navigator.geolocation.getCurrentPosition()
↓
User Location: { latitude: 37.7749, longitude: -122.4194 }
```

### **3. Finds Nearest Location**
```javascript
// Calls backend API
POST /api/map/nearby
{
  placeType: "non_emergency_shelter",
  latitude: 37.7749,
  longitude: -122.4194
}
↓
// Backend calls Google Places API (New)
// Returns nearest matching location
```

### **4. Displays Map**
```
✅ Shows Google Maps iframe
✅ Marks the nearest location
✅ Updates every 3 seconds automatically
✅ Shows distance and directions
```

---

## 📍 **Place Type Mapping:**

The app searches for different locations based on classification:

| Classification | Search Query |
|---------------|--------------|
| **non_emergency_shelter** | "Community shelter, homeless resource center, or non-profit housing assistance near me" |
| **non_emergency_police** | "Police station, community precinct, or non-emergency law enforcement office" |
| **non_emergency_medical** | "Urgent care clinic, local health center, or non-emergency walk-in medical facility" |

---

## 🔧 **Setup Required:**

### **Step 1: Get Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable these APIs:
   - ✅ **Places API (New)**
   - ✅ **Maps Embed API** (for iframe map display)
   - ✅ **Geolocation API** (optional, for better location accuracy)

4. Create credentials:
   - Navigate to: **APIs & Services > Credentials**
   - Click: **Create Credentials > API Key**
   - Copy your API key

5. Restrict your API key (recommended):
   - Click on your API key
   - Under **Application restrictions**: Select "HTTP referrers"
   - Add: `http://localhost:3000/*` (for development)
   - Under **API restrictions**: Select "Restrict key"
   - Choose: Places API (New), Maps Embed API

### **Step 2: Add to .env File**

**Update `/Applications/Resqueaid/.env`:**
```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**⚠️ IMPORTANT:** The `.env` file is in `.gitignore` - never commit your API key!

### **Step 3: Restart Backend**

```bash
cd /Applications/Resqueaid
# Kill existing backend process
pkill -f "node backend/server.js"

# Start backend
node backend/server.js
```

---

## 🎨 **UI Features:**

### **Map Display:**
- ✅ 600px × 400px responsive iframe
- ✅ Rounded corners with shadow
- ✅ Centered location marker
- ✅ "Auto-updating every 3s" indicator

### **Location Info:**
- ✅ Location name (e.g., "Community Shelter")
- ✅ Full address
- ✅ Distance from user

### **Navigation Instructions:**
```
┌─────────────────────────────────────┐
│ Make your way to location showing   │
│ above.                              │
│ Keep calm.                          │
└─────────────────────────────────────┘
```
- ✅ Centrally aligned
- ✅ Gradient background (#4CA9A5 → #2E3A59)
- ✅ Bold white text

### **"Open in Google Maps" Button:**
- ✅ Opens native Google Maps app
- ✅ Provides turn-by-turn directions
- ✅ Auto-detects user's current location

---

## 🔄 **Auto-Refresh Feature:**

The map refreshes every **3 seconds** to:
- ✅ Update user's moving location
- ✅ Find closer locations if user moves
- ✅ Show real-time data

**How it works:**
```javascript
// Runs every 3 seconds
setInterval(() => {
  fetchNearbyLocation(); // Calls API again
}, 3000);
```

**Visual indicator:**
```
🟢 Auto-updating every 3s
```
- Pulsing green dot
- Positioned top-right of map

---

## 🧪 **Testing:**

### **Test 1: Shelter Request**
```bash
# Login to app
# Enter: "I need shelter for tonight"
# Result: Shows nearest community shelter
```

### **Test 2: Medical Request**
```bash
# Enter: "I need to see a doctor"
# Result: Shows nearest urgent care clinic
```

### **Test 3: Police Request**
```bash
# Enter: "I need to file a report"
# Result: Shows nearest police station
```

### **Test 4: Map Auto-Update**
```bash
# Watch the map for 10 seconds
# Notice: "Auto-updating every 3s" indicator
# Result: Map refreshes periodically
```

---

## 📊 **API Response Example:**

**Request:**
```json
POST /api/map/nearby
{
  "placeType": "non_emergency_shelter",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response:**
```json
{
  "placeId": "ChIJd_dJQYKAhYARt7...",
  "name": "Community Resource Center",
  "address": "123 Main St, San Francisco, CA 94102",
  "latitude": 37.7833,
  "longitude": -122.4167,
  "category": "non_emergency_shelter"
}
```

---

## 🚨 **Error Handling:**

### **No API Key:**
```json
{
  "error": "Server configuration error: Maps API Key is not set."
}
```
**Fix:** Add `GOOGLE_MAPS_API_KEY` to `.env`

### **Location Permission Denied:**
```
User Message: "Could not get your location. Using default."
Fallback: Uses San Francisco coordinates (37.7749, -122.4194)
```

### **No Nearby Locations:**
```json
{
  "message": "No nearby non emergency shelter location found.",
  "category": "non_emergency_shelter"
}
```
**UI:** Shows error message in map section

### **API Key Invalid:**
```json
{
  "error": "Permission denied. Check API Key validity and ensure Places API (New) is enabled."
}
```
**Fix:** Verify API key and enable Places API (New)

---

## 💰 **Cost Considerations:**

### **Google Maps Pricing:**
- **Places API (New) - Text Search:** $32 per 1,000 requests
- **Maps Embed API:** Free (unlimited)
- **Free tier:** $200/month credit (~6,250 searches)

### **Optimization:**
- ✅ Only requests 1 result (`maxResultCount: 1`)
- ✅ Limited fields (name, location, address, placeId)
- ✅ 5km search radius (efficient)
- ⚠️ Auto-refresh every 3s (consider increasing to 5-10s for production)

**To reduce costs:**
```javascript
// Change in ResultsPage.js
setInterval(() => {
  setMapRefreshCount(prev => prev + 1);
}, 10000); // 10 seconds instead of 3
```

---

## 🔐 **Security:**

### **Backend Protection:**
- ✅ API key stored in `.env` (never exposed to frontend)
- ✅ Routes protected with JWT authentication
- ✅ Input validation (latitude, longitude, placeType)

### **Frontend:**
- ✅ Uses backend proxy for API calls
- ✅ No API key in client-side code
- ✅ Error boundaries for failed requests

---

## 📱 **Mobile Support:**

The map is fully responsive:
- ✅ Works on mobile browsers
- ✅ Detects user's GPS location
- ✅ "Open in Google Maps" button opens native app
- ✅ Touch-friendly interface

---

## 🎯 **What Happens Next:**

1. **User sees the map** with nearest location
2. **Reads instructions:** "Make your way to location showing above"
3. **Clicks "Open in Google Maps"** for directions
4. **Travels to location** while map updates
5. **Arrives and receives assistance**

---

## 🔄 **Future Enhancements:**

### **Possible Improvements:**
- 🔜 Show multiple locations (top 3)
- 🔜 Filter by open hours
- 🔜 Show walking/driving time
- 🔜 Add location ratings/reviews
- 🔜 Real-time traffic updates
- 🔜 Save favorite locations

---

## 🐛 **Troubleshooting:**

### **Map not showing:**
1. Check browser console for errors
2. Verify GOOGLE_MAPS_API_KEY in `.env`
3. Ensure Maps Embed API is enabled
4. Allow location access in browser

### **"No location found":**
1. Check if Places API (New) is enabled
2. Verify API key has correct restrictions
3. Try increasing search radius (5km → 10km)
4. Check if location has relevant places nearby

### **Auto-refresh not working:**
1. Check browser console for errors
2. Verify backend `/api/map/nearby` is responding
3. Ensure JWT token is valid
4. Check network tab for API calls

---

## 📚 **Files Modified:**

### **Backend:**
```
/backend/controllers/mapController.js (NEW)
/backend/routes/mapRoutes.js (NEW)
/backend/server.js (UPDATED)
/.env (UPDATE REQUIRED)
```

### **Frontend:**
```
/frontend/src/components/ResultsPage.js (UPDATED)
/frontend/src/services/api.js (UPDATED)
/frontend/src/App.css (UPDATED)
```

---

## ✅ **Checklist:**

- [ ] Get Google Maps API Key
- [ ] Enable Places API (New)
- [ ] Enable Maps Embed API
- [ ] Add API key to `.env`
- [ ] Restart backend server
- [ ] Test with shelter request
- [ ] Test with medical request
- [ ] Test with police request
- [ ] Verify map displays correctly
- [ ] Test "Open in Google Maps" button
- [ ] Check auto-refresh indicator

---

## 🎉 **Summary:**

**Your non-emergency page now:**
- ✅ Shows Google Maps with nearest location
- ✅ Updates every 3 seconds automatically
- ✅ Provides clear navigation instructions
- ✅ Opens native Google Maps for directions
- ✅ Handles errors gracefully
- ✅ Works on mobile and desktop

**Just add your Google Maps API key to get started!** 🚀

---

**Need help? Check the console logs or refer to this guide!** 📖

