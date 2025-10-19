# DisAID - Disaster Relief AI Application

An intelligent disaster relief application that uses AI to classify emergency requests and connect users with nearby assistance using real-time location services.

---

##  Features

- ** AI-Powered Classification** - Uses Google Gemini AI to analyze and categorize help requests
- ** Emergency Detection** - Automatically identifies and prioritizes life-threatening situations  
- ** Smart Location Services** - Finds nearby facilities using GPS + Gemini AI + OpenStreetMap
- ** Google Maps Integration** - Embedded maps and automatic turn-by-turn navigation
- ** Emergency Contacts** - Context-specific emergency phone numbers with one-tap dialing
- ** Lightweight Database** - SQLite for fast, network-independent operation

---

## Tech Stack

**Backend:**
- Node.js + Express
- SQLite (database)
- Google Gemini AI (classification & suggestions)
- OpenStreetMap Nominatim (geocoding)
- JWT (authentication)

**Frontend:**
- React.js
- React Router
- Axios
- Google Maps (free embed + URL scheme)

**All APIs are FREE!** Perfect for demos and MVPs.

---

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Gemini API Key (free from: https://makersuite.google.com/app/apikey)

### Installation

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

**Backend (`backend/.env`):**
```env
PORT=5001
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=https://disaid-frontend.onrender.com
```

### Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
node serverSQLite.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Open http://localhost:3000 in your browser.

---

## 📖 How It Works

1. **User submits a help request** (text description of their situation)
2. **Gemini AI classifies** the request as emergency/non-emergency and categorizes it (medical/shelter/police)
3. **Browser gets user's GPS location**
4. **System finds nearby facilities:**
   - Gets city name from coordinates (OpenStreetMap)
   - Gemini suggests real organizations in that city
   - Geocodes addresses to precise coordinates (OpenStreetMap)
5. **Results displayed:**
   - **Emergency:** Call simulation + emergency numbers + immediate guidance
   - **Non-Emergency:** Embedded map + auto-opens Google Maps navigation + list of resources

---

## 🗂️ Project Structure

```
Resqueaid/
├── backend/
│   ├── controllers/
│   │   ├── geminiController.js    # AI classification logic
│   │   └── mapController.js       # Location services
│   ├── routes/
│   │   ├── authSQLite.js         # Authentication routes
│   │   ├── helpRequestSQLite.js  # Help request routes
│   │   ├── geminiRoutes.js       # AI analysis routes
│   │   └── mapRoutes.js          # Map/location routes
│   ├── models/
│   │   ├── UserSQLite.js         # User model
│   │   └── HelpRequestSQLite.js  # Help request model
│   ├── middleware/
│   │   └── authSQLite.js         # JWT authentication
│   ├── database/
│   │   └── sqlite.js             # Database setup
│   └── serverSQLite.js           # Main server file
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Auth.js           # Login/Registration
│       │   ├── HelpRequest.js    # Request submission
│       │   ├── ResultsPage.js    # Non-emergency results
│       │   └── EmergencyPage.js  # Emergency page
│       ├── services/
│       │   └── api.js            # API client
│       └── App.js                # Main app component
│
└── README.md
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Help Requests
- `POST /api/help-request` - Submit help request (stores in database)

### AI Classification
- `POST /api/gemini/analyze` - Analyze text and classify request

### Location Services
- `POST /api/map/nearby` - Find nearby facilities (protected route)

---

## 🗺️ How Maps Work (Without Paid APIs!)

### 1. Embedded Map
Uses Google's free iframe embed:
```
https://www.google.com/maps?q=LAT,LNG&output=embed&z=15
```
No API key needed!

### 2. Navigation
Uses Google Maps URL scheme:
```
https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=ADDRESS
```
Opens full Google Maps with turn-by-turn directions.

### 3. Location Suggestions
- **Gemini AI** suggests real organizations based on user's city
- **OpenStreetMap** converts addresses to coordinates (free, no key!)
- **Browser Geolocation API** gets user's GPS position

**Result:** Professional mapping experience with zero API costs! 🎉

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Gemini API Not Working
1. Verify API key in `backend/.env`
2. Check key is valid at https://makersuite.google.com/app/apikey
3. Ensure no extra spaces in `.env` file

### Maps Not Showing
1. Check browser console (F12) for errors
2. Allow location access when prompted
3. Disable VPN for accurate GPS
4. Try clearing browser cache

### Location Override (for testing)
```javascript
// Run in browser console
localStorage.setItem("userLocation", JSON.stringify({
  latitude: 30.2672,  // Austin, TX
  longitude: -97.7431
}));
location.reload();
```

---

## 🎓 For Developers

### Classification Keywords

**Emergency indicators:** urgent, emergency, critical, dying, bleeding, immediately, help me, life-threatening

**Categories:**
- **Medical:** doctor, hospital, medical, injury, sick, pain, health
- **Shelter:** homeless, shelter, housing, home, place to stay
- **Police:** police, crime, theft, assault, safety, danger

### Adding New Features

The codebase is modular and easy to extend:
- Add new routes in `backend/routes/`
- Add new controllers in `backend/controllers/`
- Add new React components in `frontend/src/components/`
- Update AI prompts in `geminiController.js` or `mapController.js`

### Environment Variables

Required:
- `GEMINI_API_KEY` - For AI classification and location suggestions
- `JWT_SECRET` - For user authentication

Optional:
- `GOOGLE_MAPS_API_KEY` - Enhanced maps (works without it!)
- `PORT` - Backend port (default: 5001)

---

## 📝 License

MIT License - feel free to use for hackathons, student projects, or commercial applications!

---

## Contributing

This project was built for disaster relief. Contributions welcome!

---

## Perfect For

-  Hackathons (free + impressive!)
-  Student projects (no billing required)
-  MVPs (validate ideas fast)
-  Non-profits (limited budgets)
- Portfolio projects (production-quality UX)

---

**Need help? Check `SETUP_FOR_FRIEND.md` for detailed setup instructions or `SETUP_INSTRUCTIONS.md` for troubleshooting guides.**

---

Made for helping people in need.
