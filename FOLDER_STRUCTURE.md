# 📁 Project Folder Structure

```
ResQueAid/
│
├── 📂 backend/                      # Backend (Node.js + Express)
│   ├── 📂 middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── 📂 models/
│   │   └── User.js                 # User schema (MongoDB/Mongoose)
│   ├── 📂 routes/
│   │   └── auth.js                 # Authentication routes (login/register)
│   └── server.js                   # Main server file
│
├── 📂 frontend/                     # Frontend (React)
│   ├── 📂 public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Auth.js            # Login/Register component
│   │   │   └── Dashboard.js        # User dashboard
│   │   ├── 📂 context/
│   │   │   └── AuthContext.js      # Authentication state management
│   │   ├── 📂 services/
│   │   │   └── api.js              # Axios API configuration
│   │   ├── App.js                  # Main App component
│   │   ├── App.css                 # Styles
│   │   └── index.js                # React entry point
│   ├── .env.example                # Environment variables template
│   └── package.json                # Frontend dependencies
│
├── 📄 .env                          # Backend environment variables
├── 📄 .env.example                  # Environment template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Backend dependencies
│
├── 📚 Documentation Files:
├── README.md                        # Main documentation
├── START_HERE.md                    # Quick start guide
├── SECURITY_GUIDE.md                # Security features explained
├── API_TESTING.md                   # API testing guide
└── FOLDER_STRUCTURE.md              # This file
```

---

## 📦 Key Files Explained

### Backend Files

**`backend/server.js`**
- Main Express server
- MongoDB connection
- Middleware setup (CORS, JSON parsing)
- Route registration
- Error handling

**`backend/models/User.js`**
- User schema definition
- Password hashing with bcrypt
- Password comparison method
- Email validation
- Role-based access (user, volunteer, admin)

**`backend/routes/auth.js`**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- Input validation
- JWT token generation

**`backend/middleware/auth.js`**
- JWT token verification
- Route protection
- Role-based authorization
- User authentication

---

### Frontend Files

**`frontend/src/App.js`**
- Main application component
- Authentication state management
- Conditional rendering (Auth vs Dashboard)

**`frontend/src/components/Auth.js`**
- Login/Register form
- Form validation
- Error handling
- Beautiful disaster aid themed UI
- Toggle between login and register

**`frontend/src/components/Dashboard.js`**
- User dashboard (after login)
- Display user information
- Logout functionality

**`frontend/src/context/AuthContext.js`**
- Global authentication state
- Login/Register/Logout functions
- Token management
- User state persistence

**`frontend/src/services/api.js`**
- Axios configuration
- API base URL setup
- Request interceptors (adds JWT token)
- API endpoints for authentication

**`frontend/src/App.css`**
- Beautiful gradient designs
- Responsive layout
- Disaster aid color theme
- Form styling
- Animations

---

## 🔄 Data Flow

### Registration Flow:
```
Frontend (Auth.js)
  ↓ [POST request with user data]
Backend (routes/auth.js)
  ↓ [Validate input]
User Model (User.js)
  ↓ [Hash password with bcrypt]
MongoDB
  ↓ [Store user data]
Backend
  ↓ [Generate JWT token]
Frontend (AuthContext.js)
  ↓ [Store token, update state]
Dashboard (Dashboard.js)
  ✓ [User logged in]
```

### Login Flow:
```
Frontend (Auth.js)
  ↓ [POST request with credentials]
Backend (routes/auth.js)
  ↓ [Find user by email]
User Model (User.js)
  ↓ [Compare password with hash]
Backend
  ↓ [Generate JWT token]
Frontend (AuthContext.js)
  ↓ [Store token, update state]
Dashboard (Dashboard.js)
  ✓ [User logged in]
```

### Protected Route Access:
```
Frontend (api.js)
  ↓ [Request with Authorization header]
Backend (middleware/auth.js)
  ↓ [Verify JWT token]
Backend (routes/auth.js)
  ↓ [Return user data]
Frontend (AuthContext.js)
  ↓ [Update user state]
Dashboard (Dashboard.js)
  ✓ [Display user info]
```

---

## 🗄️ Database Structure

**MongoDB Database:** `resqueaid`

**Collection:** `users`

**Document Schema:**
```javascript
{
  _id: ObjectId("..."),
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  role: String (enum: user/volunteer/admin),
  phone: String,
  location: {
    type: String,
    coordinates: [Number, Number],
    address: String
  },
  createdAt: Date
}
```

---

## 🔐 Security Layers

```
User Input
  ↓
[Client-Side Validation] (React forms)
  ↓
[Server-Side Validation] (express-validator)
  ↓
[Password Hashing] (bcrypt)
  ↓
[MongoDB Storage] (Mongoose)
  ↓
[JWT Token] (jsonwebtoken)
  ↓
[Authorization Header] (Bearer token)
  ↓
[Protected Routes] (auth middleware)
```

---

## 📝 Environment Variables

**Backend (`.env`):**
```
MONGODB_URI=mongodb://localhost:27017/resqueaid
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Development Commands

**Install Dependencies:**
```bash
npm install                    # Backend
cd frontend && npm install     # Frontend
```

**Run Development:**
```bash
npm run dev                    # Backend (with nodemon)
cd frontend && npm start       # Frontend (React dev server)
```

**Production Build:**
```bash
cd frontend && npm run build   # Creates optimized build
```

---

## 🎯 File Purposes at a Glance

| File | Purpose |
|------|---------|
| `server.js` | Main backend server |
| `User.js` | Database schema + password hashing |
| `routes/auth.js` | API endpoints for auth |
| `middleware/auth.js` | JWT verification |
| `Auth.js` | Login/Register UI |
| `Dashboard.js` | User dashboard UI |
| `AuthContext.js` | Global auth state |
| `api.js` | API client configuration |
| `App.css` | All styles |
| `.env` | Configuration secrets |

---

This structure follows best practices for MERN stack applications with clear separation of concerns!

