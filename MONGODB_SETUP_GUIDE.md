# 🗄️ MongoDB Setup & Verification Guide

## ✅ Your Current MongoDB Status

**Connection:** ✅ Connected  
**Database:** `resqueaid`  
**Collection:** `users`  
**User Count:** 1  

---

## 📊 Your Account Information

### Stored in MongoDB:
- **Name:** Sam
- **Email:** samrakshanadhikari@gmail.com
- **Phone:** 7373889882
- **Role:** user
- **Password:** SECURELY HASHED with bcrypt ✓
- **Created:** Oct 18, 2025

### To Login:
- **Email:** `samrakshanadhikari@gmail.com`
- **Password:** The password you entered during signup

---

## 🔐 How Password Security Works

### When You Register:
```
1. You enter password: "mypassword123"
   ↓
2. Backend receives it
   ↓
3. Bcrypt adds salt and hashes it
   ↓
4. Stored in MongoDB: "$2a$10$wwz.sORtllkCDfGx1DtQSus5aVXXJ..."
```

### When You Login:
```
1. You enter password: "mypassword123"
   ↓
2. Backend retrieves hashed password from MongoDB
   ↓
3. Bcrypt compares your input with stored hash
   ↓
4. If match: Generate JWT token → Login success! ✓
   If no match: "Invalid email or password" ✗
```

**Important:** Your actual password is NEVER stored in the database!

---

## 💻 MongoDB Commands Reference

### Check MongoDB Status:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### View Your Database:
```bash
# Connect to your database
mongosh resqueaid

# See all collections
show collections

# Count users
db.users.countDocuments()

# View all users (passwords are hashed)
db.users.find().pretty()

# Find specific user
db.users.findOne({ email: "samrakshanadhikari@gmail.com" })
```

### View User Without Password Field:
```bash
mongosh resqueaid --eval "db.users.find({}, {password: 0}).pretty()"
```

### Common MongoDB Operations:
```bash
# Connect to database
mongosh resqueaid

# Count documents
db.users.countDocuments()

# Find by email
db.users.findOne({ email: "your@email.com" })

# List all databases
show dbs

# Current database
db.getName()

# Exit MongoDB shell
exit
```

---

## 🚀 MongoDB Setup (Already Done!)

Your MongoDB is already properly configured! Here's what was set up:

### 1. MongoDB Connection
- **Host:** localhost
- **Port:** 27017
- **Database:** resqueaid
- **Connection String:** `mongodb://localhost:27017/resqueaid`

### 2. User Schema (Mongoose Model)
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: String (user/volunteer/admin),
  phone: String,
  location: {
    type: Point,
    coordinates: [longitude, latitude],
    address: String
  },
  createdAt: Date
}
```

### 3. Security Features
✅ Password hashing (bcrypt, 10 salt rounds)  
✅ Unique email addresses  
✅ Email validation  
✅ JWT token authentication  
✅ Password comparison method  
✅ Automatic password hashing on save  

---

## 🧪 Testing Your Setup

### Test 1: Check Backend Connection
```bash
curl http://localhost:5001
```
Expected: `{"message":"ResQueAid API is running!"}`

### Test 2: Test Login with Wrong Password (Security Check)
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"samrakshanadhikari@gmail.com","password":"wrong"}'
```
Expected: `{"message":"Invalid email or password"}`

### Test 3: View Database
```bash
mongosh resqueaid --eval "db.users.countDocuments()"
```
Expected: `1` (your user)

### Test 4: Check Password is Hashed
```bash
mongosh resqueaid --eval "db.users.findOne().password"
```
Expected: Long hash starting with `$2a$10$...`

---

## 🔍 Verify Everything is Working

Run this complete verification:

```bash
# 1. Check MongoDB is running
echo "1. Checking MongoDB..."
mongosh --eval "db.adminCommand('ping')" --quiet

# 2. Check backend is running
echo "2. Checking Backend..."
curl -s http://localhost:5001

# 3. Count users in database
echo "3. Counting users..."
mongosh resqueaid --eval "db.users.countDocuments()" --quiet

# 4. Verify password is hashed
echo "4. Verifying password security..."
mongosh resqueaid --eval "db.users.findOne().password.substring(0, 10)" --quiet
```

If all commands work, your setup is perfect! ✅

---

## 📱 How to Use Your App

### Register New Users:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in details
4. Choose role (User/Volunteer)
5. Click "Create Account"
6. Automatically logged in! ✓

### Login Existing Users:
1. Go to http://localhost:3000
2. If on signup page, click "Sign In"
3. Enter email: `samrakshanadhikari@gmail.com`
4. Enter your password
5. Click "Sign In"
6. Redirected to Dashboard! ✓

### What Happens After Login:
- JWT token stored in browser's localStorage
- Token included in all API requests
- Access to protected routes
- View dashboard with user info
- Logout button available

---

## 🛠️ MongoDB Management

### Start MongoDB:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Check status
brew services list | grep mongo
```

### Stop MongoDB:
```bash
# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

### MongoDB Configuration:
- **Config file:** `/opt/homebrew/etc/mongod.conf`
- **Data directory:** `/opt/homebrew/var/mongodb`
- **Log file:** `/opt/homebrew/var/log/mongodb/mongo.log`

---

## 🔐 Security Best Practices (Already Implemented!)

### ✅ What's Secure:
1. **Passwords:** Hashed with bcrypt (10 rounds)
2. **Authentication:** JWT tokens (30-day expiry)
3. **Database:** Mongoose schema validation
4. **Email:** Unique constraint, format validation
5. **API:** CORS enabled, input validation
6. **Storage:** Passwords never stored in plain text

### 🚨 For Production (Future):
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add refresh tokens
- [ ] Enable MongoDB encryption at rest
- [ ] Regular database backups

---

## 📊 Database Schema Visualization

```
MongoDB Server (localhost:27017)
  └─ Database: resqueaid
      └─ Collection: users
          └─ Document (Your User):
              {
                _id: ObjectId("68f3d6f492046da4444cceb9"),
                name: "Sam",
                email: "samrakshanadhikari@gmail.com",
                password: "$2a$10$...[HASHED]",
                role: "user",
                phone: "7373889882",
                location: {
                  type: "Point",
                  coordinates: [0, 0]
                },
                createdAt: ISODate("2025-10-18T18:05:40.243Z")
              }
```

---

## 🎯 Quick Reference Card

| Action | Command |
|--------|---------|
| View your user | `mongosh resqueaid --eval "db.users.find().pretty()"` |
| Count users | `mongosh resqueaid --eval "db.users.countDocuments()"` |
| Check MongoDB | `mongosh --eval "db.adminCommand('ping')"` |
| Test backend | `curl http://localhost:5001` |
| Start backend | `cd /Applications/Resqueaid && npm run dev` |
| Start frontend | `cd /Applications/Resqueaid/frontend && npm start` |

---

## ✅ Your Setup Checklist

- [x] MongoDB installed and running
- [x] Database `resqueaid` created
- [x] Collection `users` created
- [x] User account created (Sam)
- [x] Password hashed with bcrypt
- [x] Backend API running (port 5001)
- [x] Frontend running (port 3000)
- [x] MongoDB connected to backend
- [x] User can register
- [x] User can login
- [x] JWT authentication working
- [x] Data persists in database

**🎉 Everything is set up correctly!**

---

## 🆘 Troubleshooting

### Problem: Can't login
**Solution:** Make sure you're using the exact password you entered during signup

### Problem: MongoDB not connecting
**Solution:** 
```bash
brew services restart mongodb-community
```

### Problem: Backend not responding
**Solution:**
```bash
cd /Applications/Resqueaid
npm run dev
```

### Problem: Frontend not loading
**Solution:**
```bash
cd /Applications/Resqueaid/frontend
npm start
```

---

**Your MongoDB setup is complete and working perfectly!** 🚀

