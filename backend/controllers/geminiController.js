// Google Gemini AI Integration for Disaster Aid Classification
const HelpRequest = require('../models/HelpRequest');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the GoogleGenerativeAI client with the API key from environment variables
// Make sure to add GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Map Gemini classification keywords to database categories
 */
const mapKeywordToCategory = (keyword) => {
  const mapping = {
    'invalid': { category: 'other', urgency: 'low' },
    'non_emergency_shelter': { category: 'shelter_needed', urgency: 'medium' },
    'non_emergency_police': { category: 'rescue_needed', urgency: 'medium' },
    'non_emergency_medical': { category: 'medical_emergency', urgency: 'medium' },
    'emergency_shelter': { category: 'shelter_needed', urgency: 'critical' },
    'emergency_police': { category: 'rescue_needed', urgency: 'critical' },
    'emergency_medical': { category: 'medical_emergency', urgency: 'critical' },
  };
  
  return mapping[keyword] || { category: 'other', urgency: 'medium' };
};

/**
 * Simple fallback classifier (used when Gemini API fails)
 * @param {String} userText - The text to analyze
 * @returns {Object} Classification result
 */
const analyzeWithFallback = (userText) => {
  const text = userText.toLowerCase();
  
  // Simple analysis: Just look for basic emergency indicators
  const hasEmergency = /help|emergency|urgent|critical|immediately|dying|trapped|danger|attack|fire|flood/i.test(text);
  const hasMedical = /medical|doctor|hospital|health|sick|injured|hurt|pain|bleeding|breath/i.test(text);
  const hasPolice = /police|crime|robbery|theft|attack|danger|break|weapon|violence/i.test(text);
  const hasShelter = /shelter|house|home|building|roof|flood|fire|earthquake|evacuate/i.test(text);
  
  // Determine category
  let category = 'shelter'; // default
  if (hasMedical) category = 'medical';
  else if (hasPolice) category = 'police';
  else if (hasShelter) category = 'shelter';
  
  // Determine urgency
  const urgency = hasEmergency ? 'emergency' : 'non_emergency';
  
  const keyword = `${urgency}_${category}`;
  const { category: cat, urgency: urg } = mapKeywordToCategory(keyword);
  
  return {
    key: keyword,
    category: cat,
    urgency: urg,
    rawResponse: `[${keyword}] - AI classification unavailable, using basic fallback`,
    usedFallback: true,
  };
};

/**
 * Analyzes text using Gemini AI (with simple fallback)
 * @param {String} userText - The text to analyze
 * @returns {Object} Classification result
 */
const analyzeWithGemini = async (userText) => {
  try {
    // Construct a clear prompt for Gemini to analyze naturally
    const prompt = `You are an AI assistant for a disaster relief organization called DisAID.

Analyze this help request and classify it:
"${userText}"

Determine:
1. Is this an EMERGENCY (life-threatening, immediate danger) or NON-EMERGENCY?
2. What type of help is needed: MEDICAL, SHELTER, or POLICE?

Rules:
- If unethical or abusive: return [invalid]
- Emergency medical situations: return [emergency_medical]
- Emergency shelter/rescue: return [emergency_shelter]
- Emergency police/safety: return [emergency_police]
- Non-urgent medical: return [non_emergency_medical]
- Non-urgent shelter: return [non_emergency_shelter]
- Non-urgent police: return [non_emergency_police]

Respond with ONLY ONE keyword in brackets, nothing else.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisResultText = response.text();

    console.log('Gemini raw response:', analysisResultText);

    // Extract the keyword from brackets
    const extractedKey = analysisResultText.match(/\[(.*?)\]/);

    if (extractedKey && extractedKey[1]) {
      const keyword = extractedKey[1];
      const { category, urgency } = mapKeywordToCategory(keyword);
      
      console.log(`✅ Gemini classified as: ${keyword}`);
      
      return {
        key: keyword,
        category,
        urgency,
        rawResponse: analysisResultText,
        usedFallback: false,
      };
    } else {
      console.error("Could not extract keyword from Gemini response");
      throw new Error("Invalid Gemini response format");
    }

  } catch (error) {
    console.error("❌ Gemini API failed:", error.message);
    console.log("Using simple fallback classifier...");
    return analyzeWithFallback(userText);
  }
};

/**
 * Analyzes a user's request from req.body (for direct API calls)
 * @param {object} req - The Express request object
 * @param {object} res - The Express response object
 */
const analyzeRequest = async (req, res) => {
  try {
    const { userText } = req.body;

    if (!userText) {
      return res.status(400).json({
        message: "Bad Request: No text provided for analysis."
      });
    }

    const result = await analyzeWithGemini(userText);
    
    console.log(`Gemini analysis complete. Key: ${result.key}`);
    
    // Send the result back to the frontend
    res.status(200).json({
      key: result.key,
      category: result.category,
      urgency: result.urgency,
    });

  } catch (error) {
    console.error("Error in analyzeRequest:", error);
    res.status(500).json({
      message: "An error occurred while analyzing the request.",
      error: error.message
    });
  }
};

/**
 * Process a single help request with Gemini AI from database
 * @param {String} helpRequestId - MongoDB ID of the help request
 */
const processHelpRequest = async (helpRequestId) => {
  try {
    // 1. Fetch the help request from database
    const helpRequest = await HelpRequest.findById(helpRequestId);
    
    if (!helpRequest) {
      throw new Error('Help request not found');
    }

    if (helpRequest.status !== 'pending') {
      console.log(`Request ${helpRequestId} already processed`);
      return helpRequest;
    }

    // 2. Update status to processing
    helpRequest.status = 'processing';
    await helpRequest.save();

    // 3. Analyze with Gemini
    const geminiResult = await analyzeWithGemini(helpRequest.situation);

    // 4. Update the help request with classification results
    helpRequest.classification = {
      category: geminiResult.category,
      urgency: geminiResult.urgency,
      keywords: [],
      aiSummary: `Classified as ${geminiResult.key}: ${helpRequest.situation.substring(0, 100)}...`,
      confidence: geminiResult.usedFallback ? 0.75 : 0.95,
    };
    helpRequest.status = 'classified';
    await helpRequest.save();

    console.log(`✅ Successfully processed help request ${helpRequestId} - ${geminiResult.key}`);
    return helpRequest;

  } catch (error) {
    console.error(`❌ Error processing help request ${helpRequestId}:`, error);
    
    // Update status to pending so it can be retried
    await HelpRequest.findByIdAndUpdate(helpRequestId, { 
      status: 'pending' 
    });
    
    throw error;
  }
};

/**
 * Process all pending help requests in batch
 * Call this periodically (e.g., every minute) or trigger after new submission
 */
const processPendingRequests = async () => {
  try {
    console.log('🔍 Checking for pending help requests...');
    
    // Fetch all pending requests
    const pendingRequests = await HelpRequest.find({ 
      status: 'pending' 
    })
      .sort({ createdAt: 1 }) // Process oldest first
      .limit(10); // Process 10 at a time

    if (pendingRequests.length === 0) {
      console.log('No pending requests to process');
      return;
    }

    console.log(`📋 Found ${pendingRequests.length} pending requests`);

    // Process each request
    const results = await Promise.allSettled(
      pendingRequests.map(req => processHelpRequest(req._id))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Processed: ${successful} successful, ${failed} failed`);
    
    return { successful, failed, total: pendingRequests.length };

  } catch (error) {
    console.error('❌ Error processing pending requests:', error);
    throw error;
  }
};

module.exports = {
  analyzeRequest,
  processHelpRequest,
  processPendingRequests,
  analyzeWithGemini, // Export for use in other controllers
};

