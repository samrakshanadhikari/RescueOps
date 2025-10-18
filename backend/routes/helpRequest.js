const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');
const auth = require('../middleware/auth');

// @route   POST /api/help-request
// @desc    Submit a new help request
// @access  Public (can be changed to Private with auth middleware)
router.post('/', async (req, res) => {
  try {
    const { situation, wordCount } = req.body;

    // Validation
    if (!situation || !situation.trim()) {
      return res.status(400).json({ 
        message: 'Please provide a description of your situation' 
      });
    }

    if (wordCount > 500) {
      return res.status(400).json({ 
        message: 'Description exceeds 500 word limit' 
      });
    }

    // Create new help request
    const helpRequest = new HelpRequest({
      situation: situation.trim(),
      wordCount,
      status: 'pending', // Will be picked up by Gemini controller later
    });

    await helpRequest.save();

    res.status(201).json({
      message: 'Help request submitted successfully',
      requestId: helpRequest._id,
      status: helpRequest.status,
    });

    // TODO: Trigger Gemini processing
    // You can add this later in geminiController.js:
    // processWithGemini(helpRequest._id);
    
  } catch (error) {
    console.error('Error submitting help request:', error);
    res.status(500).json({ 
      message: 'Server error while submitting request' 
    });
  }
});

// @route   GET /api/help-request/pending
// @desc    Get all pending help requests (for Gemini processing)
// @access  Private (should be restricted to admin/system)
router.get('/pending', async (req, res) => {
  try {
    const pendingRequests = await HelpRequest.find({ 
      status: 'pending' 
    })
      .sort({ createdAt: 1 }) // Oldest first
      .limit(50); // Process in batches

    res.json({
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ 
      message: 'Server error while fetching requests' 
    });
  }
});

// @route   GET /api/help-request/:id
// @desc    Get a specific help request by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ 
        message: 'Help request not found' 
      });
    }

    res.json(helpRequest);
  } catch (error) {
    console.error('Error fetching help request:', error);
    res.status(500).json({ 
      message: 'Server error while fetching request' 
    });
  }
});

// @route   PUT /api/help-request/:id/classify
// @desc    Update help request with Gemini classification
// @access  Private (for Gemini controller)
router.put('/:id/classify', async (req, res) => {
  try {
    const { classification } = req.body;

    const helpRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          classification,
          status: 'classified',
        },
      },
      { new: true }
    );

    if (!helpRequest) {
      return res.status(404).json({ 
        message: 'Help request not found' 
      });
    }

    res.json({
      message: 'Classification updated successfully',
      helpRequest,
    });
  } catch (error) {
    console.error('Error updating classification:', error);
    res.status(500).json({ 
      message: 'Server error while updating classification' 
    });
  }
});

// @route   GET /api/help-request
// @desc    Get all help requests with filters
// @access  Private (admin)
router.get('/', async (req, res) => {
  try {
    const { status, category, urgency } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter['classification.category'] = category;
    if (urgency) filter['classification.urgency'] = urgency;

    const helpRequests = await HelpRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      count: helpRequests.length,
      requests: helpRequests,
    });
  } catch (error) {
    console.error('Error fetching help requests:', error);
    res.status(500).json({ 
      message: 'Server error while fetching requests' 
    });
  }
});

module.exports = router;

