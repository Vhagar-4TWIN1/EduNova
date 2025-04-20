import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const ExamPage = () => {
  const videoRef = useRef(null);
  const tabSwitchCount = useRef(0);
  const [violations, setViolations] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Fraud detection rules
  const FRAUD_RULES = [
    "Only one person allowed in camera view",
    "Face must be centered and visible at all times",
    "No looking away from the screen",
    "No switching tabs/windows",
    "No copy/paste allowed",
    "No speaking or communicating with others"
  ];

  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);
      } catch (error) {
        showAlert('Error', 'Failed to load face detection models. Please refresh the page.');
      }
    };

    // Start webcam
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        showAlert('Camera Required', 'Camera access is required for this exam. Please enable permissions.');
      }
    };

    // Enhanced face detection
    const detectFace = async () => {
      if (!videoRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        // Multiple faces detected
        if (detections.length > 1) {
          logViolation('Multiple faces detected');
          showAlert('Proctoring Alert', 'Only one person is allowed during the exam.');
          return;
        }

        // No face detected
        if (detections.length === 0) {
          logViolation('No face detected');
          showAlert('Attention Required', 'Please position yourself in front of the camera.');
          return;
        }

        // Single face analysis
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        const leftEyeCenter = {
          x: (leftEye[0].x + leftEye[3].x) / 2,
          y: (leftEye[1].y + leftEye[5].y) / 2,
        };

        const rightEyeCenter = {
          x: (rightEye[0].x + rightEye[3].x) / 2,
          y: (rightEye[1].y + rightEye[5].y) / 2,
        };

        const eyeDistanceX = Math.abs(rightEyeCenter.x - leftEyeCenter.x);
        const videoWidth = videoRef.current.videoWidth;
        const faceCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
        const screenCenterX = videoWidth / 2;
        const deviation = faceCenterX - screenCenterX;

        // Looking away detection
        if (Math.abs(deviation) > 40) {
          logViolation('Face not centered');
          showAlert('Focus Alert', 'Please face the screen directly.');
        } 
        // Too far from camera
        else if (eyeDistanceX < 35) {
          logViolation('Too far from camera');
          showAlert('Position Alert', 'Please move closer to the camera.');
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        logViolation(`Tab switch detected (${tabSwitchCount.current}x)`);
        showAlert('Window Focus', 'You must stay on this exam page. Repeated violations may result in termination.');
      }
    };

    // Disable copy-paste functionality
    const disableCopyPaste = (e) => {
      e.preventDefault();
      logViolation(`${e.type} attempt detected`);
      showAlert('Security Violation', 'Copy-paste is disabled during the exam!');
    };

    // Show alert with auto-dismiss
    const showAlert = (title, message) => {
      setWarningMessage({ title, message });
      setShowWarning(true);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    };

    // Log violations
    const logViolation = (description) => {
      const timestamp = new Date().toISOString();
      setViolations(prev => [...prev, { timestamp, description }]);
    };

    // Initialize monitoring
    const initMonitoring = async () => {
      await loadModels();
      await startVideo();
      const interval = setInterval(detectFace, 2000);

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('copy', disableCopyPaste);
      document.addEventListener('paste', disableCopyPaste);
      document.addEventListener('cut', disableCopyPaste);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('copy', disableCopyPaste);
        document.removeEventListener('paste', disableCopyPaste);
        document.removeEventListener('cut', disableCopyPaste);
      };
    };

    initMonitoring();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
      </div>

      <div style={styles.content}>
        <div style={styles.examContent}>
          {/* Your exam content would go here */}
          <h2>Exam Questions Will Appear Here</h2>
          <p>This area would contain your exam questions and interface.</p>
        </div>

        <div style={styles.sidePanel}>
          <div style={styles.rulesPanel}>
            <h3 style={styles.panelTitle}>Exam Rules</h3>
            <ul style={styles.rulesList}>
              {FRAUD_RULES.map((rule, index) => (
                <li key={index} style={styles.ruleItem}>
                  <span style={styles.ruleIcon}></span> {rule}
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.cameraPanel}>
            
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={styles.video}
            />
            <div style={styles.statusLight}></div>
            <p style={styles.cameraStatus}>Camera Active</p>
          </div>

          
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div style={styles.warningModal}>
          <div style={styles.warningContent}>
            <h3 style={styles.warningTitle}>{warningMessage.title}</h3>
            <p style={styles.warningText}>{warningMessage.message}</p>
            <button 
              style={styles.warningButton}
              onClick={() => setShowWarning(false)}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  timer: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flex: 1,
    padding: '20px',
  },
  examContent: {
    flex: 3,
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    marginRight: '20px',
  },
  sidePanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rulesPanel: {
    backgroundColor: '#fff8e1',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#2c3e50',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  rulesList: {
    margin: 0,
    paddingLeft: '20px',
  },
  ruleItem: {
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  ruleIcon: {
    marginRight: '8px',
  },
  cameraPanel: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  video: {
    width: '100%',
    borderRadius: '4px',
    border: '2px solid #e0e0e0',
    marginBottom: '10px',
  },
  statusLight: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    display: 'inline-block',
    marginRight: '8px',
    animation: 'pulse 2s infinite',
  },
  cameraStatus: {
    display: 'inline',
    fontSize: '14px',
    color: '#666',
  },
  violationsPanel: {
    backgroundColor: '#ffebee',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  violationsList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  violationItem: {
    padding: '8px 0',
    borderBottom: '1px solid #ffcdd2',
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  violationTime: {
    color: '#666',
  },
  violationText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  warningModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  warningContent: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  warningTitle: {
    color: '#d32f2f',
    marginTop: 0,
  },
  warningText: {
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  warningButton: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ExamPage;