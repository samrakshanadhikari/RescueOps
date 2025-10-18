# 🗄️ How to View Your MongoDB Data

## What You Have:

✅ **Local MongoDB** running on your Mac (NOT cloud/Atlas)  
✅ **Location:** localhost:27017  
✅ **Database Name:** resqueaid  
✅ **Collection:** users  
✅ **Your Data:** 1 user (Sam)

---

## 🖥️ Method 1: Command Line (MongoDB Shell)

### Step-by-Step Instructions:

**1. Open Terminal**

**2. Connect to your database:**
```bash
mongosh resqueaid
```

You'll see:
```
Connecting to: mongodb://127.0.0.1:27017/resqueaid
resqueaid>
```

**3. View your data - Copy and paste these commands:**

```javascript
// See everything about your user (including hashed password)
db.users.find().pretty()

// See your data WITHOUT the password field
db.users.find({}, { password: 0 }).pretty()

// Just count how many users you have
db.users.countDocuments()

// Find by email
db.users.findOne({ email: "samrakshanadhikari@gmail.com" })

// See only specific fields
db.users.find({}, { name: 1, email: 1, role: 1, _id: 0 })

// Exit the MongoDB shell
exit
```

---

## 🖼️ Method 2: MongoDB Compass (Visual Tool - RECOMMENDED!)

MongoDB Compass is like "Finder" but for your database - you can see everything visually!

### Installation:
```bash
brew install --cask mongodb-compass
```

### How to Use:
1. **Open MongoDB Compass** from Applications
2. **Connection String:** `mongodb://localhost:27017`
3. **Click "Connect"**
4. **Navigate:** 
   - Click `resqueaid` database (left sidebar)
   - Click `users` collection
5. **See Your Data!** 
   - You'll see a table with all your users
   - Click on any row to see details
   - Password will show as hash: `$2a$10$...`

### Screenshot of what you'll see:
```
┌─────────────────────────────────────────────────────┐
│ resqueaid > users                                   │
├─────────────────────────────────────────────────────┤
│ _id          | name | email                  | ... │
│ 68f3d6f4...  | Sam  | samrakshanadhikari@... | ... │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Method 3: VS Code Extension (For Developers)

If you use VS Code:

1. **Install Extension:** "MongoDB for VS Code"
2. **Connect:** Click MongoDB icon in sidebar
3. **Add Connection:** `mongodb://localhost:27017`
4. **Browse:** Navigate to resqueaid > users
5. **Query:** Right-click and run queries

---

## 💻 Quick Commands Reference

### Connect to Database:
```bash
mongosh resqueaid
```

### Most Useful Commands:

| Command | What It Does |
|---------|-------------|
| `db.users.find().pretty()` | Show all users (formatted) |
| `db.users.countDocuments()` | Count total users |
| `db.users.findOne()` | Show first user |
| `show collections` | List all collections |
| `db.getName()` | Show current database name |
| `exit` | Exit MongoDB shell |

---

## 🔍 Example Session (What You'll See):

```bash
$ mongosh resqueaid

resqueaid> db.users.find().pretty()
[
  {
    _id: ObjectId('68f3d6f492046da4444cceb9'),
    name: 'Sam',
    email: 'samrakshanadhikari@gmail.com',
    password: '$2a$10$wwz.sORtllkCDfGx1DtQSus5aVXXJ/wxXkIscg8ikaUHYSXtEVlxW',
    role: 'user',
    phone: '7373889882',
    location: { type: 'Point', coordinates: [ 0, 0 ] },
    createdAt: ISODate('2025-10-18T18:05:40.243Z'),
    __v: 0
  }
]

resqueaid> db.users.countDocuments()
1

resqueaid> exit
bye
```

---

## 🎯 What I Did (How I Accessed Your Data):

I ran these exact commands:

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Count your users
mongosh resqueaid --eval "db.users.countDocuments()"

# View your user data
mongosh resqueaid --eval "db.users.find().pretty()"
```

**That's it!** No cloud, no special access - just your local MongoDB running on your Mac! 🖥️

---

## 📊 Understanding Your MongoDB Setup

```
Your Mac (localhost)
│
├── MongoDB Server (port 27017)
│   └── Database: resqueaid
│       └── Collection: users
│           └── Document #1: Your user (Sam)
│
├── Backend Server (port 5001)
│   └── Connects to MongoDB
│   └── API endpoints for auth
│
└── Frontend (port 3000)
    └── Sends requests to Backend
    └── User signs up/login
```

**Flow:**
1. You signup on frontend (port 3000)
2. Frontend sends data to backend (port 5001)
3. Backend hashes password with bcrypt
4. Backend saves to MongoDB (port 27017)
5. Data is stored locally on YOUR computer!

---

## 🔐 Security Note

Your password shown in MongoDB:
```
$2a$10$wwz.sORtllkCDfGx1DtQSus5aVXXJ/wxXkIscg8ikaUHYSXtEVlxW
```

This is a **HASH**, not your actual password!
- Cannot be reversed to get original password
- Different from your real password
- Secure encryption using bcrypt
- Even I (or anyone) cannot see your real password!

---

## 🚀 Try It Yourself Now!

**Open a new terminal and type:**
```bash
mongosh resqueaid
```

Then type:
```javascript
db.users.find().pretty()
```

You'll see YOUR data! 🎉

---

## 📱 MongoDB Atlas (Cloud) vs Local

### What You're Using (Local):
- ✅ Runs on your Mac
- ✅ Free forever
- ✅ Fast (local)
- ✅ No internet needed
- ❌ Only accessible from your computer
- ❌ No automatic backups

### MongoDB Atlas (Cloud):
- ✅ Runs on MongoDB's servers
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Free tier available
- ❌ Requires internet
- ❌ Slightly slower (network latency)

**For learning and development, local MongoDB is perfect!** ✓

---

## 🆘 Troubleshooting

### "mongosh: command not found"
MongoDB Shell not installed. Run:
```bash
brew install mongosh
```

### "MongoServerError: connect ECONNREFUSED"
MongoDB server not running. Start it:
```bash
brew services start mongodb-community
```

### "No users found"
Check you're in the right database:
```bash
mongosh resqueaid --eval "db.getName()"
```

---

**Now you know how to view your MongoDB data!** 🎊

Try it yourself in the terminal - it's easy! 🚀

