import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmergencyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classification, situation } = location.state || {};
  
  const [callStatus, setCallStatus] = useState('calling'); // calling, connected, ended
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!classification || !classification.key || !classification.key.includes('emergency')) {
      navigate('/help');
      return;
    }

    // Simulate call timer when connected
    let timer;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus, classification, navigate]);

  if (!classification) {
    return null;
  }

  const getEmergencyNumbers = () => {
    const keyword = classification.key;

    return {
      emergency_medical: [
        { name: 'Emergency Medical Services (EMS)', number: '911', description: 'For life-threatening medical emergencies' },
        { name: 'Poison Control', number: '1-800-222-1222', description: 'For poisoning emergencies' },
        { name: 'National Suicide Prevention Lifeline', number: '988', description: 'For mental health crises' },
      ],
      emergency_shelter: [
        { name: 'Emergency Services', number: '911', description: 'For immediate danger or rescue needs' },
        { name: 'FEMA Disaster Assistance', number: '1-800-621-3362', description: 'For disaster-related shelter needs' },
        { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', description: 'For domestic violence situations' },
      ],
      emergency_police: [
        { name: 'Emergency Services', number: '911', description: 'For immediate threats or crimes in progress' },
        { name: 'National Human Trafficking Hotline', number: '1-888-373-7888', description: 'For human trafficking situations' },
        { name: 'CyberTipline', number: '1-800-843-5678', description: 'For child exploitation emergencies' },
      ],
    }[keyword] || [
      { name: 'Emergency Services', number: '911', description: 'Call 911 for any emergency' }
    ];
  };

  const getEmergencyInfo = () => {
    const keyword = classification.key;

    const info = {
      emergency_medical: {
        title: '🚨 MEDICAL EMERGENCY',
        subtitle: 'Emergency Medical Services',
        department: 'Emergency Medical Response',
        color: '#d32f2f',
        bgColor: '#ffebee',
        icon: '🚑',
        message: 'Medical emergency team has been alerted',
      },
      emergency_shelter: {
        title: '🚨 EMERGENCY SHELTER ASSISTANCE',
        subtitle: 'Emergency Shelter & Rescue',
        department: 'Emergency Shelter Response',
        color: '#e65100',
        bgColor: '#fff3e0',
        icon: '🏠',
        message: 'Emergency shelter team has been dispatched',
      },
      emergency_police: {
        title: '🚨 EMERGENCY POLICE ASSISTANCE',
        subtitle: 'Emergency Police Response',
        department: 'Emergency Police Services',
        color: '#1565c0',
        bgColor: '#e3f2fd',
        icon: '👮',
        message: 'Police emergency response unit is on the way',
      },
    };

    return info[keyword] || info.emergency_shelter;
  };

  const info = getEmergencyInfo();

  const handlePickUp = () => {
    setCallStatus('connected');
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/help');
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="emergency-page" style={{ background: info.bgColor }}>
      <div className="emergency-container">
        {/* Emergency Header */}
        <div className="emergency-header" style={{ borderLeftColor: info.color }}>
          <h1 style={{ color: info.color }}>{info.title}</h1>
          <p className="emergency-subtitle">{info.message}</p>
        </div>

        {/* Location Ping Status */}
        <div className="location-ping">
          <div className="ping-animation">
            <div className="ping-circle"></div>
            <div className="ping-circle delay-1"></div>
            <div className="ping-circle delay-2"></div>
            <span className="location-icon">📍</span>
          </div>
          <p className="location-text">Your location is being pinged.</p>
        </div>

        {/* Call Window */}
        <div className="call-window" style={{ borderColor: info.color }}>
          <div className="call-header" style={{ background: info.color }}>
            <span className="call-icon">{info.icon}</span>
            <div className="call-info">
              <h3>{info.department}</h3>
              <p className="call-subtitle">{info.subtitle}</p>
            </div>
          </div>

          <div className="call-body">
            {callStatus === 'calling' && (
              <div className="call-status">
                <div className="calling-animation">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring delay-1"></div>
                  <div className="pulse-ring delay-2"></div>
                  <span className="phone-icon">📞</span>
                </div>
                <p className="status-text">Connecting to emergency services...</p>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="call-status">
                <div className="connected-icon">✅</div>
                <p className="status-text">Connected</p>
                <p className="call-timer">{formatTime(elapsedTime)}</p>
                <p className="status-subtext">Emergency operator is on the line</p>
              </div>
            )}

            {callStatus === 'ended' && (
              <div className="call-status">
                <div className="ended-icon">📵</div>
                <p className="status-text">Call Ended</p>
                <p className="status-subtext">Redirecting...</p>
              </div>
            )}
          </div>

          <div className="call-actions">
            {callStatus === 'calling' && (
              <button 
                className="pickup-button"
                onClick={handlePickUp}
                style={{ background: '#4caf50' }}
              >
                <span className="button-icon">📞</span>
                Pick Up
              </button>
            )}

            {callStatus === 'connected' && (
              <button 
                className="end-call-button"
                onClick={handleEndCall}
                style={{ background: '#d32f2f' }}
              >
                <span className="button-icon">📵</span>
                End Call
              </button>
            )}

            {callStatus === 'ended' && (
              <button 
                className="return-button"
                onClick={() => navigate('/help')}
                style={{ background: '#2196f3' }}
              >
                Return to Help
              </button>
            )}
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="reassurance-message">
          <div className="reassurance-icon">🆘</div>
          <p className="reassurance-text">Help is on the way, keep calm.</p>
          <p className="reassurance-subtext">
            Emergency responders have been notified and are en route to your location.
          </p>
        </div>

        {/* Emergency Phone Numbers */}
        <div className="emergency-phone-numbers">
          <h3 style={{ color: info.color }}>📞 Emergency Phone Numbers</h3>
          <p className="phone-instructions">
            Click any number below to call immediately, or use the demo call simulation above.
          </p>

          {/* Primary Emergency Button */}
          <div className="primary-emergency-call">
            <a
              href="tel:911"
              className="emergency-call-button primary"
              onClick={() => {
                console.log('📞 Initiating emergency call to 911');
                setCallStatus('calling');
              }}
            >
              <span className="call-icon">🚨</span>
              <div className="call-info">
                <span className="call-number">CALL 911 NOW</span>
                <span className="call-description">Emergency Services</span>
              </div>
            </a>
          </div>

          {/* Additional Emergency Numbers */}
          <div className="additional-emergency-numbers">
            {getEmergencyNumbers().map((emergency, index) => (
              <a
                key={index}
                href={`tel:${emergency.number}`}
                className="emergency-call-button secondary"
                onClick={() => console.log(`📞 Calling ${emergency.name}: ${emergency.number}`)}
              >
                <span className="call-icon">📞</span>
                <div className="call-info">
                  <span className="call-number">{emergency.number}</span>
                  <span className="call-description">{emergency.name}</span>
                  <span className="call-details">{emergency.description}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="emergency-tips">
          <h4>While you wait:</h4>
          <ul>
            <li>Stay in a safe location</li>
            <li>Keep your phone nearby</li>
            <li>Follow operator instructions when connected</li>
            <li>Do not hang up unless instructed</li>
          </ul>
        </div>

        {/* Situation Summary */}
        <div className="situation-summary-emergency">
          <h4>Your Emergency Request:</h4>
          <p>{situation}</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;

