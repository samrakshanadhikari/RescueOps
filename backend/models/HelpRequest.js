const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional in case anonymous requests are allowed
    },
    situation: {
      type: String,
      required: true,
      maxlength: 5000, // Roughly 500 words
    },
    wordCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'classified', 'completed', 'rejected'],
      default: 'pending',
    },
    // Gemini AI Classification Results (to be filled by Gemini Controller)
    classification: {
      category: {
        type: String,
        enum: [
          'medical_emergency',
          'shelter_needed',
          'food_water',
          'rescue_needed',
          'family_search',
          'transportation',
          'supplies',
          'other',
        ],
      },
      urgency: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
      },
      keywords: [String],
      aiSummary: String,
      confidence: Number, // 0-1 confidence score from Gemini
    },
    // Location data (optional)
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
    },
    // Response tracking
    response: {
      assigned: {
        type: Boolean,
        default: false,
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      notes: String,
      updatedAt: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for efficient queries
HelpRequestSchema.index({ status: 1, createdAt: -1 });
HelpRequestSchema.index({ 'classification.category': 1 });
HelpRequestSchema.index({ 'classification.urgency': 1 });

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);

