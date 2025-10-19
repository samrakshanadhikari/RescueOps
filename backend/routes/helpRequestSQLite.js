const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequestSQLite');
const auth = require('../middleware/auth');

// @route   POST /api/help-request
// @desc    Submit a new help request
// @access  Public
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
    const helpRequest = HelpRequest.create({
      situation: situation.trim(),
      wordCount,
    });

    res.status(201).json({
      message: 'Help request submitted successfully',
      requestId: helpRequest.id,
      status: helpRequest.status,
    });
    
  } catch (error) {
    console.error('Error submitting help request:', error);
    res.status(500).json({ 
      message: 'Server error while submitting request' 
    });
  }
});

// @route   GET /api/help-request/pending
// @desc    Get all pending help requests
// @access  Public
router.get('/pending', async (req, res) => {
  try {
    const pendingRequests = HelpRequest.findPending(50);

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
    const helpRequest = HelpRequest.findById(req.params.id);

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
// @desc    Update help request with classification
// @access  Private
router.put('/:id/classify', async (req, res) => {
  try {
    const { classification } = req.body;

    const updated = HelpRequest.updateClassification(req.params.id, classification);

    if (!updated) {
      return res.status(404).json({ 
        message: 'Help request not found' 
      });
    }

    const helpRequest = HelpRequest.findById(req.params.id);

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
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, category, urgency } = req.query;
    
    const helpRequests = HelpRequest.findAll({ status, category, urgency }, 100);

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


