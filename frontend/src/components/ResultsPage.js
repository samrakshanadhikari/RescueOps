import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mapAPI } from '../services/api';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classification, situation } = location.state || {};

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocation, setNearbyLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // Get user's current location
  useEffect(() => {
    // Check for manual location override in localStorage
    const manualLocation = localStorage.getItem('userLocation');
    if (manualLocation) {
      try {
        const loc = JSON.parse(manualLocation);
        console.log('📍 Using MANUAL location override from localStorage:');
        console.log(`   Latitude: ${loc.latitude}`);
        console.log(`   Longitude: ${loc.longitude}`);
        console.log('💡 To clear: localStorage.removeItem("userLocation")');
        setUserLocation(loc);
        return;
      } catch (e) {
        console.error('Invalid manual location in localStorage');
      }
    }

    // Otherwise, use browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          console.log('🌍 Browser Location Detected:');
          console.log(`   Latitude: ${lat}`);
          console.log(`   Longitude: ${lng}`);
          console.log(`   Accuracy: ${position.coords.accuracy} meters`);
          
          // Check if coordinates are reasonable for US
          if (lng > 0) {
            console.warn('⚠️ WARNING: Longitude is positive (Eastern Hemisphere)');
            console.warn('⚠️ You might be detected in Europe/Asia instead of US!');
            console.warn('⚠️ Are you using a VPN? Your browser thinks you\'re in Europe!');
            console.warn('💡 QUICK FIX: Run this in console:');
            console.warn('   localStorage.setItem("userLocation", JSON.stringify({latitude: 30.2672, longitude: -97.7431})); location.reload();');
          }
          
          setUserLocation({
            latitude: lat,
            longitude: lng,
          });
        },
        (error) => {
          console.error('❌ Error getting user location:', error);
          setLocationError('Could not get your location. Using default.');
          // Default location (San Francisco)
          setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
        }
      );
    } else {
      setLocationError('Geolocation not supported by browser.');
      setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
    }
  }, []);

  // Fetch nearby location when user location is available (only once)
  useEffect(() => {
    if (userLocation && classification.key) {
      fetchNearbyLocation();
    }
  }, [userLocation, classification.key]);

  const fetchNearbyLocation = async () => {
    try {
      setLoadingLocation(true);
      const response = await mapAPI.findNearby(
        classification.key,
        userLocation.latitude,
        userLocation.longitude
      );
      setNearbyLocation(response.data);
      setLoadingLocation(false);
      
      // Automatically open Google Maps with directions using ADDRESS (much better than coordinates!)
      // Encode the address properly for URL
      const destinationAddress = encodeURIComponent(response.data.address || response.data.name);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destinationAddress}&destination_place_id=&travelmode=driving`;
      
      console.log('🗺️ Opening Google Maps with destination:', response.data.address || response.data.name);
      window.open(mapsUrl, '_blank');
    } catch (error) {
      console.error('Error fetching nearby location:', error);
      setLocationError(error.response?.data?.error || 'Could not find nearby location');
      setLoadingLocation(false);
    }
  };

  const getClassificationInfo = () => {
    const info = {
      invalid: {
        title: '❌ Invalid Request',
        message: 'Your request could not be processed. Please ensure your message is appropriate and does not contain abusive language.',
        color: '#c62828',
        bgColor: '#ffebee',
      },
      non_emergency_shelter: {
        title: '🏠 Non-Emergency Shelter Request',
        message: 'We have received your shelter assistance request. Our team will contact you within 24-48 hours.',
        color: '#1976d2',
        bgColor: '#e3f2fd',
      },
      non_emergency_police: {
        title: '👮 Non-Emergency Police Assistance',
        message: 'Your request has been forwarded to local authorities. They will respond as soon as possible.',
        color: '#1976d2',
        bgColor: '#e3f2fd',
      },
      non_emergency_medical: {
        title: '🏥 Non-Emergency Medical Assistance',
        message: 'Your medical assistance request has been received. A healthcare coordinator will reach out to you.',
        color: '#1976d2',
        bgColor: '#e3f2fd',
      },
      emergency_shelter: {
        title: '🚨 EMERGENCY SHELTER NEEDED',
        message: 'Your URGENT shelter request is being prioritized. Emergency response team will contact you immediately.',
        color: '#d32f2f',
        bgColor: '#ffcdd2',
        urgent: true,
      },
      emergency_police: {
        title: '🚨 EMERGENCY POLICE REQUIRED',
        message: 'Your URGENT request has been sent to emergency services. Help is on the way. Stay safe!',
        color: '#d32f2f',
        bgColor: '#ffcdd2',
        urgent: true,
      },
      emergency_medical: {
        title: '🚨 MEDICAL EMERGENCY',
        message: 'Your CRITICAL medical emergency has been prioritized. Emergency medical services are being dispatched.',
        color: '#d32f2f',
        bgColor: '#ffcdd2',
        urgent: true,
      },
    };

    return info[classification.key] || info.invalid;
  };

  const info = getClassificationInfo();

  // Redirect if no classification data
  useEffect(() => {
    if (!classification) {
      navigate('/help');
    }
  }, [classification, navigate]);

  const handleNewRequest = () => {
    navigate('/help');
  };

  // Don't render if no classification
  if (!classification) {
    return null;
  }

  return (
    <div className="results-page">
      <div className="results-container">
        <div 
          className="results-card"
          style={{
            borderLeft: `6px solid ${info.color}`,
            background: info.bgColor,
          }}
        >
          <div className="results-header">
            <h1 style={{ color: info.color }}>{info.title}</h1>
          </div>

          <div className="results-body">
            <p className="results-message">{info.message}</p>

            {/* Google Maps Section */}
            <div className="map-section">
              <h3 style={{ color: info.color }}>📍 Nearest Location</h3>
              
              {loadingLocation ? (
                <div className="map-loading">
                  <div className="spinner"></div>
                  <p>Finding nearest location...</p>
                </div>
              ) : nearbyLocation ? (
                <>
                  <div className="location-info">
                    <h4>{nearbyLocation.name}</h4>
                    <p className="location-address">{nearbyLocation.address}</p>
                  </div>
                  
                  <div className="map-container">
                    <iframe
                      title="Nearby Location Map"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      style={{ border: 0, borderRadius: '8px' }}
                      src={`https://www.google.com/maps?q=${nearbyLocation.latitude},${nearbyLocation.longitude}&output=embed&z=15`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onError={(e) => {
                        console.error('Map iframe failed to load');
                        e.target.style.display = 'none';
                      }}
                    ></iframe>
                  </div>

                  <div className="navigation-instructions">
                    <p className="instruction-main">Make your way to location showing above.</p>
                    <p className="instruction-sub">Keep calm.</p>
                  </div>

                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${encodeURIComponent(nearbyLocation.address || nearbyLocation.name)}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-in-maps-button"
                    style={{ background: info.color }}
                  >
                    🗺️ Open in Google Maps
                  </a>

                  {/* Display additional info from Gemini */}
                  {nearbyLocation.additionalInfo && (
                    <div className="additional-info">
                      <h4>ℹ️ Additional Information:</h4>
                      <p>{nearbyLocation.additionalInfo}</p>
                    </div>
                  )}

                  {/* Display list of organizations */}
                  {nearbyLocation.organizations && nearbyLocation.organizations.length > 0 && (
                    <div className="organizations-list">
                      <h3 style={{ color: info.color }}>📋 Available Resources in Your Area</h3>
                      {nearbyLocation.organizations.map((org, index) => (
                        <div key={index} className="organization-card">
                          <h4>{org.name}</h4>
                          {org.description && <p className="org-description">{org.description}</p>}
                          <div className="org-contact-info">
                            {org.phone && (
                              <p><strong>📞 Phone:</strong> <a href={`tel:${org.phone}`}>{org.phone}</a></p>
                            )}
                            {org.address && (
                              <p><strong>📍 Address:</strong> {org.address}</p>
                            )}
                            {org.website && (
                              <p><strong>🌐 Website:</strong> <a href={org.website} target="_blank" rel="noopener noreferrer">{org.website}</a></p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="location-error">
                  <p>{locationError || 'No nearby location found'}</p>
                </div>
              )}
            </div>

            <div className="classification-details">
              <h3>Classification Details:</h3>
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value">{classification.category}</span>
              </div>
              <div className="detail-item">
                <span className="label">Urgency:</span>
                <span 
                  className="value urgency-badge"
                  style={{
                    background: info.urgent ? '#d32f2f' : '#1976d2',
                    color: 'white',
                  }}
                >
                  {classification.urgency.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="situation-summary">
              <h3>Your Request:</h3>
              <p className="situation-text">{situation}</p>
            </div>
          </div>

          <div className="results-actions">
            <button 
              className="new-request-button"
              onClick={handleNewRequest}
            >
              Submit Another Request
            </button>
          </div>
        </div>

        <div className="next-steps">
          <h2>What Happens Next?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <p>Visit the location shown on the map</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Speak with staff about your situation</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Receive assistance and support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

