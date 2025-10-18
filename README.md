# ResQueAid - Disaster Assistance Application

A full-stack disaster assistance aid application built with React, Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Secure Authentication**: User registration and login with JWT tokens
- **Password Security**: Bcrypt password hashing for secure credential storage
- **Beautiful UI**: Modern, responsive design with disaster aid theme
- **MongoDB Integration**: Secure user data storage
- **Role-Based Access**: Support for users, volunteers, and admins

## 🛠️ Tech Stack

### Frontend
- React 18
- Axios for API calls
- Context API for state management
- Modern CSS with gradient designs

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup Instructions

1. **Clone and Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. **Configure Environment Variables**

Create a `.env` file in the root directory (already created):
```
MONGODB_URI=mongodb://localhost:27017/resqueaid
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a secure random string in production!

3. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

4. **Run the Application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds (10)
- Passwords are never stored in plain text
- Password validation (minimum 6 characters)

### JWT Authentication
- Secure token-based authentication
- Tokens expire after 30 days
- Tokens stored in localStorage (client-side)
- Authorization header used for protected routes

### Input Validation
- Email format validation
- Password strength requirements
- Server-side validation using express-validator

## 📝 API Endpoints

### Authentication Routes

**POST /api/auth/register**
- Register a new user
- Body: `{ name, email, password, phone, role }`
- Returns: JWT token and user data

**POST /api/auth/login**
- Login existing user
- Body: `{ email, password }`
- Returns: JWT token and user data

**GET /api/auth/me**
- Get current user data
- Requires: Authorization header with JWT token
- Returns: User data

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'volunteer', 'admin']),
  phone: String,
  location: {
    type: String,
    coordinates: [Number],
    address: String
  },
  createdAt: Date
}
```

## 🎨 UI Features

- Responsive design for mobile and desktop
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Form validation with error messages
- Loading states for better UX

## 📱 User Roles

1. **User**: Person in need of disaster assistance
2. **Volunteer**: Helper who provides aid
3. **Admin**: System administrator (for future features)

## 🔄 How Authentication Works

1. **Registration**:
   - User fills registration form
   - Backend validates input
   - Password is hashed with bcrypt
   - User is saved to MongoDB
   - JWT token is generated and sent to client
   - Client stores token in localStorage

2. **Login**:
   - User enters credentials
   - Backend verifies email exists
   - Password is compared with hashed version
   - JWT token is generated if valid
   - Client stores token and redirects to dashboard

3. **Protected Routes**:
   - Client sends JWT token in Authorization header
   - Backend verifies token
   - User data is returned if valid

## 🚀 Next Steps

You can extend this application with:
- Emergency request system
- Real-time notifications
- Map integration for disaster zones
- Resource management
- Volunteer coordination
- Admin dashboard
- Password reset functionality
- Email verification
- Two-factor authentication

## 📄 License

MIT

## 👨‍💻 Development

This is a starter template. Feel free to customize and extend it for your specific needs!

