import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { helpRequestAPI, geminiAPI } from '../services/api';

const HelpRequest = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');
  const [analyzingStatus, setAnalyzingStatus] = useState('');

  const MAX_WORDS = 500;

  const handleTextChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;

    if (count <= MAX_WORDS) {
      setSituation(text);
      setWordCount(count);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (situation.trim() === '') {
      setError('Please describe your situation before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Step 1: Save to database
      setAnalyzingStatus('Saving your request...');
      const submitResponse = await helpRequestAPI.submit(situation, wordCount);
      setRequestId(submitResponse.data.requestId);
      
      // Step 2: Analyze with Gemini AI
      setAnalyzingStatus('Analyzing urgency with AI...');
      const geminiResponse = await geminiAPI.analyze(situation);
      
      console.log('Gemini classification:', geminiResponse.data);
      
      setLoading(false);
      setAnalyzingStatus('');
      
      // Step 3: Check if it's an emergency and route accordingly
      const isEmergency = geminiResponse.data.key && geminiResponse.data.key.startsWith('emergency_');
      
      if (isEmergency) {
        // Route to emergency page for critical situations
        navigate('/emergency', {
          state: {
            classification: geminiResponse.data,
            situation: situation,
            requestId: submitResponse.data.requestId,
          }
        });
      } else {
        // Route to normal results page for non-emergencies
        navigate('/results', {
          state: {
            classification: geminiResponse.data,
            situation: situation,
            requestId: submitResponse.data.requestId,
          }
        });
      }
      
    } catch (err) {
      setLoading(false);
      setAnalyzingStatus('');
      setError(err.response?.data?.message || err.message || 'Failed to process request. Please try again.');
      console.error('Error processing help request:', err);
    }
  };

  return (
    <div className="help-request-container">
      {/* Main Content */}
      <div className="help-request-content">
        {/* App Title */}
        <h1 className="app-title">DisAID</h1>
        
        {/* Subtitle */}
        <p className="app-subtitle">
          We are here to help you explain your situation.
        </p>

        {/* Help Request Form */}
        <form onSubmit={handleSubmit} className="help-form">
          {/* Text Box */}
          <textarea
            className="situation-textarea"
            value={situation}
            onChange={handleTextChange}
            placeholder="Please describe your situation in detail. Tell us what kind of help you need..."
            disabled={loading || submitted}
          />

          {/* Word Counter */}
          <div className="word-counter">
            <span className={wordCount >= MAX_WORDS ? 'limit-reached' : ''}>
              {wordCount} / {MAX_WORDS} words
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="request-help-button"
            disabled={loading || submitted || situation.trim() === ''}
          >
            {loading ? (analyzingStatus || 'Processing...') : submitted ? '✓ Submitted!' : 'Request Help'}
          </button>
          
          {loading && (
            <div className="analyzing-indicator">
              <div className="spinner"></div>
              <p>{analyzingStatus}</p>
            </div>
          )}
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message-help">
            {error}
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="success-message-help">
            ✓ Your request has been submitted successfully!
            <br />
            <small>Request ID: {requestId}</small>
            <br />
            Our AI is analyzing your situation and our team will respond shortly.
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpRequest;

