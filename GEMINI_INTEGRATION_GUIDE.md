# 🤖 Google Gemini AI Integration Guide

## ✅ What's Already Set Up

Your database structure is **ready** for Gemini AI integration! Here's what's in place:

### 1. **Database Model** (`backend/models/HelpRequest.js`)
- ✅ Stores user help requests
- ✅ Has fields for Gemini classification results
- ✅ Tracks processing status
- ✅ Ready for AI integration

### 2. **API Routes** (`backend/routes/helpRequest.js`)
- ✅ `POST /api/help-request` - Submit help request (stores in DB)
- ✅ `GET /api/help-request/pending` - Get requests waiting for AI
- ✅ `PUT /api/help-request/:id/classify` - Update with AI results
- ✅ `GET /api/help-request/:id` - Get specific request
- ✅ `GET /api/help-request` - Get all requests with filters

### 3. **Frontend Integration**
- ✅ Form submits to database
- ✅ Shows success message with request ID
- ✅ Error handling
- ✅ Word counter

---

## 🔮 How Data Flows

```
User Types → Frontend → Backend API → MongoDB
                                         ↓
                                    [Stored as "pending"]
                                         ↓
                             Gemini Controller accesses it
                                         ↓
                                    Gemini API processes
                                         ↓
                              Results saved back to MongoDB
                                         ↓
                                [Status: "classified"]
```

---

## 🚀 Next Steps: Adding Gemini AI

### Step 1: Get Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to your `.env` file:
```bash
GEMINI_API_KEY=your_api_key_here
```

### Step 2: Install Google Generative AI Package
```bash
cd /Applications/Resqueaid
npm install @google/generative-ai
```

### Step 3: Activate Gemini Routes
In `backend/server.js`, add:
```javascript
app.use('/api/gemini', require('./routes/geminiRoutes'));
```

### Step 4: Implement Real Gemini Processing
Edit `backend/controllers/geminiController.js`:

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const processHelpRequest = async (helpRequestId) => {
  // ... existing code ...

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Create prompt
  const prompt = `
    You are an AI assistant for a disaster relief organization. 
    Analyze the following help request and classify it.
    
    Help Request: "${helpRequest.situation}"
    
    Provide a JSON response with:
    {
      "category": "<one of: medical_emergency, shelter_needed, food_water, rescue_needed, family_search, transportation, supplies, other>",
      "urgency": "<one of: critical, high, medium, low>",
      "keywords": ["keyword1", "keyword2", ...],
      "aiSummary": "<1-2 sentence summary>",
      "confidence": <0-1 confidence score>
    }
  `;

  // Call Gemini API
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse JSON response
  const aiClassification = JSON.parse(text);

  // Update database with classification
  helpRequest.classification = aiClassification;
  helpRequest.status = 'classified';
  await helpRequest.save();

  return helpRequest;
};
```

### Step 5: Trigger Processing

**Option A: Automatic (After Each Submission)**
In `backend/routes/helpRequest.js`, after saving:
```javascript
const { processHelpRequest } = require('../controllers/geminiController');

// After helpRequest.save()
processHelpRequest(helpRequest._id).catch(console.error);
```

**Option B: Manual Trigger**
Call the API endpoint:
```bash
curl -X POST http://localhost:5001/api/gemini/process-batch
```

**Option C: Scheduled (Cron Job)**
Install `node-cron`:
```bash
npm install node-cron
```

In `backend/server.js`:
```javascript
const cron = require('node-cron');
const { processPendingRequests } = require('./controllers/geminiController');

// Process every minute
cron.schedule('* * * * *', () => {
  processPendingRequests().catch(console.error);
});
```

---

## 📊 Database Schema for Gemini Results

Your `HelpRequest` model stores:

```javascript
{
  situation: "User's help request text",
  status: "pending" | "processing" | "classified",
  classification: {
    category: "medical_emergency", // Set by Gemini
    urgency: "critical",            // Set by Gemini
    keywords: ["flood", "rescue"],  // Set by Gemini
    aiSummary: "...",               // Set by Gemini
    confidence: 0.92                // Set by Gemini
  },
  createdAt: "2025-10-18T...",
  updatedAt: "2025-10-18T..."
}
```

---

## 🧪 Testing Without Gemini API

The template controller includes **mock classification** so you can test now:

```bash
# Submit a help request (frontend)
# Then process it:
curl -X POST http://localhost:5001/api/gemini/process-batch
```

---

## 📁 Files Created for You

| File | Purpose |
|------|---------|
| `backend/models/HelpRequest.js` | ✅ Database schema |
| `backend/routes/helpRequest.js` | ✅ API routes for help requests |
| `backend/controllers/geminiController.js` | 🔜 Gemini AI processing (template) |
| `backend/routes/geminiRoutes.js` | 🔜 Gemini API routes (template) |

---

## 🔍 How Your Gemini Controller Will Access Data

```javascript
// Get pending requests
const requests = await HelpRequest.find({ status: 'pending' });

// Process each one
for (const request of requests) {
  const text = request.situation; // User's text
  // Send to Gemini API
  // Get classification
  // Update request with results
  request.classification = { ... };
  request.status = 'classified';
  await request.save();
}
```

---

## 🎯 Summary

✅ **Done**: Database stores help requests  
✅ **Done**: Frontend submits to database  
✅ **Done**: API routes to access data  
✅ **Done**: Template controller for Gemini  
🔜 **Next**: Get Gemini API key and implement real processing

**Your data is safe in MongoDB and ready for Gemini to access!** 🚀

