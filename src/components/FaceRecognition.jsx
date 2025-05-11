import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Footerpage from "./Footerpage";

const FaceRecognition = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [storedImage, setStoredImage] = useState(null);
  const [imageDescriptor, setImageDescriptor] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Face-API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models")
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };
    loadModels();

    return () => {
      // Cleanup models if needed
    };
  }, []);

  // Start webcam when models are loaded
  useEffect(() => {
    if (!isModelLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Could not access webcam. Please check permissions.");
      }
    };

    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModelLoaded]);

  // Load stored image from localStorage and process it
  const fetchImageAsDataURL = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  // Process stored image and extract face descriptor
  const processStoredImage = async (imageUrl) => {
    if (!isModelLoaded) {
      console.error("Models not loaded yet");
      return;
    }

    setIsProcessing(true);
    try {
      const dataURL = await fetchImageAsDataURL(imageUrl);
      if (!dataURL) {
        alert("Failed to load image from storage.");
        return;
      }

      const img = await faceapi.bufferToImage(await (await fetch(dataURL)).blob());
      
      const imageDetection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!imageDetection) {
        alert("No face detected in the stored image.");
        return;
      }

      setImageDescriptor(imageDetection.descriptor);
      console.log("Stored image processed successfully!");
    } catch (error) {
      console.error("Error processing stored image:", error);
      alert("Error processing stored image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Load image from localStorage after models are loaded
  useEffect(() => {
    if (!isModelLoaded) return;

    const storedImageUrl = localStorage.getItem("image");
    if (storedImageUrl) {
      setStoredImage(storedImageUrl);
      processStoredImage(storedImageUrl);
    } else {
      alert("No stored profile image found. Please upload one.");
      navigate("/profile");
    }
  }, [isModelLoaded, navigate]);

  // Compare live camera feed with stored image
  const compareFaceWithStoredImage = async () => {
    if (!isModelLoaded || !imageDescriptor) {
      alert("System not ready yet. Please wait.");
      return;
    }

    if (!videoRef.current) {
      alert("Webcam not accessible.");
      return;
    }

    setIsProcessing(true);
    try {
      const webcamDetection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!webcamDetection) {
        alert("No face detected in the webcam.");
        return;
      }

      const distance = faceapi.euclideanDistance(
        webcamDetection.descriptor,
        imageDescriptor
      );
      console.log("Euclidean Distance:", distance);

      const similarityThreshold = 0.5;
      const role = localStorage.getItem("role");
      
      if (distance < similarityThreshold) {
        alert("✅ Match Found! The face matches the stored profile image.");
        navigate(role === 'Admin' ? "/dashboard" : "/home");
      } else {
        alert("❌ No Match. The face does not match the stored image.");
        // Clear user data
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("image");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during face comparison:", error);
      alert("Error during face recognition. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="face-recognition-container">
      <div className="logo-container">
        <Logo />
      </div>

      <div className="face-recognition-content">
        <h1 className="face-recognition-title">Face Verification</h1>
        <p className="face-recognition-subtitle">Please position your face in the frame</p>

        <div className="face-comparison-container">
          {/* Stored Image */}
          <div className="stored-image-container">
            <h3 className="section-title">Your Profile</h3>
            {storedImage ? (
              <div className="image-wrapper">
                <img 
                  src={storedImage} 
                  alt="Stored Profile" 
                  className="profile-image"
                />
              </div>
            ) : (
              <div className="no-image-placeholder">
                <i className="fas fa-user-slash"></i>
                <p>No profile image found</p>
              </div>
            )}
          </div>

          {/* Live Camera Feed */}
          <div className="camera-feed-container">
            <h3 className="section-title">Live Camera</h3>
            <div className="video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="camera-feed"
              />
              <canvas ref={canvasRef} className="face-overlay" />
              {!isModelLoaded && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <p>Loading face recognition models...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          className="verify-button"
          onClick={compareFaceWithStoredImage}
          disabled={!isModelLoaded || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="button-spinner"></span>
              Verifying...
            </>
          ) : (
            "Verify My Identity"
          )}
        </button>
      </div>

      <Footerpage />

      <style jsx>{`
        .face-recognition-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          padding: 2rem;
          position: relative;
        }

        .logo-container {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 10;
        }

        .face-recognition-content {
          width: 100%;
          max-width: 1200px;
          margin: 4rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .face-recognition-title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-align: center;
        }

        .face-recognition-subtitle {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin-bottom: 2rem;
          text-align: center;
        }

        .face-comparison-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .stored-image-container, .camera-feed-container {
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-title {
          font-size: 1.3rem;
          color: #34495e;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .image-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .profile-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
  aspect-ratio: 1/1; /* Ensures perfect circle by maintaining 1:1 aspect ratio */
}

        .no-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #95a5a6;
          padding: 2rem;
        }

        .no-image-placeholder i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          padding-top: 75%; /* 4:3 aspect ratio */
          border-radius: 8px;
          overflow: hidden;
          background: #2c3e50;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .camera-feed, .face-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }

        .verify-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 200px;
          box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);
          margin-top: 1rem;
        }

        .verify-button:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(52, 152, 219, 0.4);
        }

        .verify-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .button-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .face-comparison-container {
            flex-direction: column;
          }

          .face-recognition-title {
            font-size: 2rem;
          }

          .video-wrapper {
            padding-top: 133%; /* 3:4 aspect ratio for mobile */
          }
        }
      `}</style>
      
    </div>
  );
};

export default FaceRecognition;
