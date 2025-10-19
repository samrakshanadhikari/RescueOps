# 🔑 Gemini API Key Issue - Fix Guide

## ⚠️ Problem Detected

Your API key `AIzaSyAnF2caMcOS-fJ1wY3ylXOzvOMDCq2qhzY` is not working with any Gemini models.

All these failed:
- ❌ gemini-pro
- ❌ gemini-1.5-pro
- ❌ gemini-1.5-flash
- ❌ gemini-1.5-pro-latest
- ❌ gemini-1.0-pro

---

## 🔍 Possible Causes:

### 1. **API Key Not Enabled for Generative AI**
Your API key might be created but not enabled for the Generative AI API.

### 2. **Wrong Service**
This key might be for a different Google service (Maps, Cloud, etc.) instead of Gemini.

### 3. **Billing Not Enabled**
Gemini API might require billing to be enabled.

### 4. **API Key Restrictions**
The key might have IP restrictions or other limitations.

---

## ✅ **How to Fix:**

### **Option 1: Get a NEW Gemini API Key** (Recommended)

1. **Go to Google AI Studio:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Click "Create API Key"**

3. **Select or Create a Google Cloud Project**
   - Choose "Create new project" OR
   - Select an existing project

4. **Copy the NEW API Key**
   - It will look like: `AIzaSy...`

5. **Update your `.env` file:**
   ```bash
   GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```

6. **Restart the backend**

---

### **Option 2: Enable the API for Current Key**

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   ```

2. **Click "Enable" on Generative Language API**

3. **Wait 1-2 minutes for it to activate**

4. **Try again**

---

### **Option 3: Check API Key Settings**

1. **Go to API Credentials:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Find your API key** (`AIzaSyAnF2...`)

3. **Click on it to edit**

4. **Check:**
   - ✅ API restrictions: Should include "Generative Language API"
   - ✅ No IP restrictions (or add your IPs)
   - ✅ Key is not expired

---

## 🧪 **Test Your API Key:**

After getting a new key or fixing the old one:

```bash
cd /Applications/Resqueaid
node test-gemini.js
```

You should see:
```
✅ gemini-1.5-flash WORKS! Response: Hello...
```

---

## 🚀 **Quick Fix (Use Demo Mode):**

While you get a valid API key, I can set up a mock classifier that simulates Gemini:

**Mock Response:**
- Analyzes keywords in text
- Returns emergency/non-emergency
- Works instantly
- Perfect for testing/demo

Want me to set up mock mode? (Y/N)

---

## 📝 **Important Notes:**

- ✅ **Free Tier:** Gemini API has a free tier with limits
- ✅ **Rate Limits:** 60 requests per minute (free tier)
- ✅ **Billing:** Some features might require billing enabled
- ✅ **Region:** Available in most regions

---

## 🆘 **Still Not Working?**

Try these API key generators:
1. Google AI Studio: https://aistudio.google.com/app/apikey
2. Google Cloud Console: https://console.cloud.google.com/

Make sure you're using **Google AI Studio** (not Google Cloud) for easiest setup!

---

**Once you have a working API key, update `.env` and restart!** 🚀

