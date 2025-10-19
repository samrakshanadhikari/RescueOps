const express = require('express');
const router = express.Router();
const { findNearbyEmergencyLocation } = require('../controllers/mapController');
const { protect } = require('../middleware/authSQLite');

/**
 * @route   POST /api/map/nearby
 * @desc    Find nearby non-emergency locations (shelter, police, medical)
 * @access  Private
 */
router.post('/nearby', protect, findNearbyEmergencyLocation);

module.exports = router;

