import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudySessionTracker = ({ moduleId, lessonId }) => {
  const [sessionId, setSessionId] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSupplementary, setShowSupplementary] = useState(false);
  const [supplementaryLessons, setSupplementaryLessons] = useState([]);
  const [error, setError] = useState(null);

  // Debug states
  useEffect(() => {
    console.log('Current states:', {
      sessionId,
      showPrompt, 
      showSupplementary,
      supplementaryLessons,
      error
    });
  }, [sessionId, showPrompt, showSupplementary, supplementaryLessons, error]);

  useEffect(() => {
    let timer;
    
    const startSession = async () => {
      try {
        console.log('Starting session for module:', moduleId, 'lesson:', lessonId);
        const res = await axios.post(
          `https://edunova-back-rqxc.onrender.com/api/study/start/${moduleId}/${lessonId}`, 
          {}, 
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Session started:', res.data);
        setSessionId(res.data.sessionId);
        
        // TEST: 5 seconds instead of 60 for development
        timer = setTimeout(() => {
          console.log('Timer expired - showing prompt');
          setShowPrompt(true);
        }, 5000); // 5000ms = 5 seconds
        
      } catch (err) {
        console.error('Error starting session:', {
          message: err.message,
          response: err.response?.data
        });
        setError(err);
      }
    };

    startSession();

    return () => {
      clearTimeout(timer);
      if (sessionId) {
        console.log('Cleaning up - ending session');
        axios.post(`https://edunova-back-rqxc.onrender.com/api/study/end/${sessionId}`, {}, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => console.error('Error ending session:', err));
      }
    };
  }, [moduleId, lessonId]);

  const fetchSupplementaryLessons = async () => {
    try {
      console.log('Fetching supplementary lessons for module:', moduleId);
      const res = await axios.get(
        `https://edunova-back-rqxc.onrender.com/api/study/recommendations/${moduleId}`,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Received supplementary lessons:', res.data);
      
      if (res.data?.lessons) {
        setSupplementaryLessons(res.data.lessons);
        setShowSupplementary(true);
      } else {
        throw new Error('Invalid response format - missing lessons array');
      }
    } catch (err) {
      console.error('Error fetching supplementary lessons:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err);
      setShowSupplementary(true); // Show empty state
    }
  };

  const handleResponse = (wantsSupplementary) => {
    setShowPrompt(false);
    if (wantsSupplementary) {
      fetchSupplementaryLessons();
    }
  };

  if (error) {
    return (
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#ffebee',
        border: '1px solid #ef9a9a',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      {/* Debug overlay */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Session Tracker: {sessionId ? 'Active' : 'Inactive'}
      </div>

      {/* Prompt */}
      {showPrompt && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1001,
          width: '90%',
          maxWidth: '400px'
        }}>
          <h3 style={{ marginTop: 0 }}>More Learning Resources Available</h3>
          <p>Would you like to see additional materials for this topic?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => handleResponse(true)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Yes Please
            </button>
            <button
              onClick={() => handleResponse(false)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              No Thanks
            </button>
          </div>
        </div>
      )}

      {/* Supplementary Content */}
      {showSupplementary && (
        <div style={{
          margin: '20px 0',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          borderLeft: '4px solid #3f51b5'
        }}>
          <h3 style={{ marginTop: 0 }}>Additional Resources</h3>
          
          {supplementaryLessons.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {supplementaryLessons.map(lesson => (
                <div 
                  key={lesson._id}
                  style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <h4 style={{ marginTop: 0 }}>{lesson.title}</h4>
                  <p>{lesson.content}</p>
                  {lesson.resourceUrl && (
                    <a
                      href={lesson.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        color: '#3f51b5',
                        fontWeight: 'bold'
                      }}
                    >
                      Open Resource
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No additional resources available at this time.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudySessionTracker;