#!/bin/bash

echo "🔍 ResQueAid Setup Verification"
echo "================================"
echo ""

# Check MongoDB
echo "1️⃣  Checking MongoDB..."
if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "   ✅ MongoDB is running"
else
    echo "   ❌ MongoDB is not running"
    echo "   Run: brew services start mongodb-community"
fi
echo ""

# Check Backend
echo "2️⃣  Checking Backend API..."
if curl -s http://localhost:5001 > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5001"
    BACKEND_MSG=$(curl -s http://localhost:5001 | grep -o "ResQueAid API is running")
    if [ ! -z "$BACKEND_MSG" ]; then
        echo "   ✅ Backend API is responding"
    fi
else
    echo "   ❌ Backend is not running"
    echo "   Run: cd /Applications/Resqueaid && npm run dev"
fi
echo ""

# Check Database
echo "3️⃣  Checking Database..."
USER_COUNT=$(mongosh resqueaid --eval "db.users.countDocuments()" --quiet 2>/dev/null)
if [ ! -z "$USER_COUNT" ]; then
    echo "   ✅ Database 'resqueaid' exists"
    echo "   ✅ Users registered: $USER_COUNT"
else
    echo "   ⚠️  Could not query database"
fi
echo ""

# Check User Data
echo "4️⃣  Checking Your User Data..."
USER_EMAIL=$(mongosh resqueaid --eval "db.users.findOne().email" --quiet 2>/dev/null | tr -d '"')
if [ ! -z "$USER_EMAIL" ]; then
    echo "   ✅ Email: $USER_EMAIL"
    PASSWORD_HASH=$(mongosh resqueaid --eval "db.users.findOne().password.substring(0, 20)" --quiet 2>/dev/null | tr -d '"')
    echo "   ✅ Password: ${PASSWORD_HASH}... [HASHED]"
else
    echo "   ⚠️  No user found"
fi
echo ""

# Check Frontend
echo "5️⃣  Checking Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ⚠️  Frontend is not running"
    echo "   Run: cd /Applications/Resqueaid/frontend && npm start"
fi
echo ""

# Summary
echo "================================"
echo "📊 Setup Summary"
echo "================================"
echo "Backend:   http://localhost:5001"
echo "Frontend:  http://localhost:3000"
echo "Database:  mongodb://localhost:27017/resqueaid"
echo ""
echo "Your Login Credentials:"
if [ ! -z "$USER_EMAIL" ]; then
    echo "Email:     $USER_EMAIL"
    echo "Password:  [the password you entered during signup]"
fi
echo ""
echo "✅ Setup verification complete!"

