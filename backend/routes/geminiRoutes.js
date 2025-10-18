// Gemini API Routes
const express = require('express');
const router = express.Router();
const { 
  analyzeRequest,
  processHelpRequest, 
  processPendingRequests 
} = require('../controllers/geminiController');
const auth = require('../middleware/auth'); // Optional: protect these routes

/**
 * @route   POST /api/gemini/analyze
 * @desc    Analyze text directly (without saving to database first)
 * @access  Public
 */
router.post('/analyze', analyzeRequest);

/**
 * @route   POST /api/gemini/process/:id
 * @desc    Process a specific help request from database with Gemini AI
 * @access  Private (admin only recommended)
 */
router.post('/process/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await processHelpRequest(id);
    
    res.json({
      success: true,
      message: 'Help request processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in /process/:id:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing help request',
    });
  }
});

/**
 * @route   POST /api/gemini/process-batch
 * @desc    Process all pending help requests
 * @access  Private (admin only or cron job)
 */
router.post('/process-batch', async (req, res) => {
  try {
    const result = await processPendingRequests();
    
    res.json({
      success: true,
      message: 'Batch processing completed',
      data: result,
    });
  } catch (error) {
    console.error('Error in /process-batch:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing batch',
    });
  }
});

/**
 * @route   GET /api/gemini/stats
 * @desc    Get statistics about help request processing
 * @access  Private
 */
router.get('/stats', async (req, res) => {
  try {
    const HelpRequest = require('../models/HelpRequest');
    
    const stats = await HelpRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const categoryStats = await HelpRequest.aggregate([
      {
        $match: { 'classification.category': { $exists: true } },
      },
      {
        $group: {
          _id: '$classification.category',
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json({
      success: true,
      data: {
        byStatus: stats,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching stats',
    });
  }
});

module.exports = router;

