# 🧪 API Testing Guide

## Test Your Backend API

You can test the API endpoints using curl, Postman, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ Register a New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "user"
  }'
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6543210abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "User already exists with this email"
}
```

---

## 2️⃣ Login User

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6543210abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid email or password"
}
```

---

## 3️⃣ Get Current User

**Endpoint:** `GET /api/auth/me`

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Response (Success - 200):**
```json
{
  "user": {
    "_id": "6543210abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1234567890",
    "createdAt": "2025-10-18T12:00:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Not authorized, no token"
}
```

---

## 🧪 Postman Collection

You can import this into Postman:

1. Open Postman
2. Click "Import"
3. Copy and paste this JSON:

```json
{
  "info": {
    "name": "ResQueAid API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"phone\": \"+1234567890\",\n  \"role\": \"user\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Get Current User",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_TOKEN_HERE"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/auth/me",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "auth", "me"]
        }
      }
    }
  ]
}
```

---

## 🔍 Test Scenarios

### Test 1: Valid Registration
```bash
# Should succeed
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Test 2: Duplicate Email
```bash
# Should fail with "User already exists"
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Test 3: Invalid Email Format
```bash
# Should fail with validation error
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"notanemail","password":"test123"}'
```

### Test 4: Short Password
```bash
# Should fail - password too short
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"new@test.com","password":"12345"}'
```

### Test 5: Successful Login
```bash
# Should succeed and return token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test 6: Wrong Password
```bash
# Should fail with "Invalid email or password"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrongpassword"}'
```

### Test 7: Access Protected Route
```bash
# Replace TOKEN with actual token from login/register
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Test 8: Access Protected Route Without Token
```bash
# Should fail with "Not authorized"
curl -X GET http://localhost:5000/api/auth/me
```

---

## 📊 Expected Status Codes

| Status Code | Meaning | When It Happens |
|------------|---------|----------------|
| 200 | Success | Login successful, data retrieved |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | Invalid credentials, no token |
| 403 | Forbidden | Not enough permissions |
| 404 | Not Found | User not found |
| 500 | Server Error | Database error, server crash |

---

## 🔐 MongoDB Verification

Check if data is stored in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use resqueaid

# View all users (passwords will be hashed)
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: "test@test.com" })
```

**Note:** You'll see password is stored as a hash, NOT plain text:
```javascript
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@test.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMye...", // <-- Hashed!
  role: "user",
  createdAt: ISODate("2025-10-18T12:00:00.000Z")
}
```

---

## 🐛 Debugging Tips

**Backend not responding?**
```bash
# Check if server is running
curl http://localhost:5000

# Check MongoDB connection
# Look for: "✅ MongoDB Connected Successfully"
```

**Database errors?**
```bash
# Make sure MongoDB is running
brew services list | grep mongo
# or
ps aux | grep mongod
```

**CORS errors in browser?**
- Backend already has `cors()` enabled
- Make sure frontend is using correct API URL

---

## 🎯 Next Steps

After testing the API:
1. ✅ Verify users are stored in MongoDB
2. ✅ Verify passwords are hashed
3. ✅ Test login/register in the React frontend
4. ✅ Check JWT tokens are being sent correctly

Happy testing! 🚀

