# 🚀 Quick Start Guide - ResQueAid

Follow these simple steps to get your disaster assistance app running!

## Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies  
cd frontend
npm install
cd ..
```

## Step 2: Start MongoDB

You need MongoDB running. Choose one option:

**Option A: If you have MongoDB installed locally**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: Use Docker (easiest)**
```bash
docker run -d -p 27017:27017 --name resqueaid-mongo mongo
```

**Option C: Use MongoDB Atlas (cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in `.env` file

## Step 3: Start the Backend

Open a terminal window and run:

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected Successfully
```

## Step 4: Start the Frontend

Open ANOTHER terminal window and run:

```bash
cd frontend
npm start
```

Your browser will automatically open to http://localhost:3000

## 🎉 You're Ready!

You should now see a beautiful login/register page!

### Try It Out:

1. **Register a new account**
   - Click "Sign Up"
   - Enter your details
   - Choose role (User or Volunteer)
   - Click "Create Account"

2. **Your credentials are secure!**
   - Password is hashed with bcrypt
   - Stored safely in MongoDB
   - JWT token for authentication

3. **Login**
   - Use your email and password
   - Access your dashboard

## 🔧 Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running
- Check the connection string in `.env` file

**Port Already in Use?**
- Backend: Change PORT in `.env` file
- Frontend: It will ask you to use a different port automatically

**Module Not Found?**
- Run `npm install` in root folder
- Run `npm install` in frontend folder

## 📚 What's Next?

Check out the main `README.md` for:
- API documentation
- Security features explained
- How to extend the app
- Database schema details

## 🆘 Need Help?

All your user data is stored securely in MongoDB with:
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Input validation
- ✅ Secure API endpoints

Happy coding! 🎊

