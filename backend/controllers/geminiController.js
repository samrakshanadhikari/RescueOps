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
 * Analyzes text using Gemini API
 * @param {String} userText - The text to analyze
 * @returns {Object} Classification result
 */
const analyzeWithGemini = async (userText) => {
  try {
    // Construct the prompt for Gemini
    const customPrompt = `
      Analyze the following user-submitted text.
      User Text: "${userText}"

      Follow these instructions precisely:
      1. Analyze the user's text.
      2. Process the request. If it is unethical or contains abusive language towards any individual, asset, group, or company, your response must be only the keyword: [invalid].
      3. If the situation described by the user is a non-emergency based on general understanding, classify it as Case I.
      4. If the situation described is serious and requires immediate attention, classify it as Case II.
      5. If it is Case I (non-emergency), further classify it into one of three sub-cases and return only the corresponding keyword: [non_emergency_shelter], [non_emergency_police], or [non_emergency_medical].
      6. If it is Case II (emergency), further classify it into one of three sub-cases and return only the corresponding keyword: [emergency_shelter], [emergency_police], or [emergency_medical].

      Your final output must be ONE of these exact keywords and nothing else:
      [invalid], [non_emergency_shelter], [non_emergency_police], [non_emergency_medical], [emergency_shelter], [emergency_police], [emergency_medical]
    `;

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(customPrompt);
    const response = await result.response;
    const analysisResultText = response.text();

    // Extract the keyword from brackets e.g., "[emergency_police]" -> "emergency_police"
    const extractedKey = analysisResultText.match(/\[(.*?)\]/);

    if (extractedKey && extractedKey[1]) {
      const keyword = extractedKey[1];
      const { category, urgency } = mapKeywordToCategory(keyword);
      
      return {
        keyword,
        category,
        urgency,
        rawResponse: analysisResultText,
      };
    } else {
      console.error("Could not extract a valid key from Gemini response:", analysisResultText);
      throw new Error("Could not determine a valid classification from the AI");
    }

  } catch (error) {
    console.error("Error in Gemini analysis:", error);
    throw error;
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
    
    console.log(`Gemini analysis complete. Key: ${result.keyword}`);
    
    // Send the result back to the frontend
    res.status(200).json({
      key: result.keyword,
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
      keywords: extractKeywords(helpRequest.situation),
      aiSummary: `Classified as ${geminiResult.keyword}: ${helpRequest.situation.substring(0, 100)}...`,
      confidence: 0.90, // You can enhance this based on Gemini response
    };
    helpRequest.status = 'classified';
    await helpRequest.save();

    console.log(`✅ Successfully processed help request ${helpRequestId} - ${geminiResult.keyword}`);
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

/**
 * Helper function to extract keywords (simple version)
 * Replace with better NLP or Gemini-based extraction later
 */
const extractKeywords = (text) => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'];
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  // Count word frequency
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Get top 5 most frequent words
  const keywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  return keywords;
};

module.exports = {
  analyzeRequest,
  processHelpRequest,
  processPendingRequests,
  analyzeWithGemini, // Export for use in other controllers
};

