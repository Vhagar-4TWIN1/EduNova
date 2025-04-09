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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      padding: "20px",
      position: "relative",
      flexDirection: "column",
    }}>
      <div style={{ position: "absolute", top: "75px", left: "10px", zIndex: 10 }}>
        <Logo />
      </div>
      <Footerpage />

      <div className="container text-center mt-5">
        <h2 className="mb-3">Face Recognition System</h2>

        {/* Display Stored Image */}
        {storedImage ? (
          <div>
            <h5>Stored Profile Image</h5>
            <img 
              src={storedImage} 
              alt="Stored Profile" 
              width="200" 
              className="mt-2 border rounded" 
            />
          </div>
        ) : (
          <p className="text-danger">No stored profile image found.</p>
        )}

        {/* Video & Canvas */}
        <div className="position-relative mt-3">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="640"
            height="480"
            className="border border-primary rounded"
          />
          <canvas ref={canvasRef} className="position-absolute top-0 start-0" />
        </div>

        {!isModelLoaded && (
          <div className="mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading face recognition models...</p>
          </div>
        )}

        {/* Compare Faces Button */}
        <button 
          className="btn btn-primary mt-3" 
          onClick={compareFaceWithStoredImage}
          disabled={!isModelLoaded || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            "Compare Face with Stored Image"
          )}
        </button>
      </div>
    </div>
  );
};

export default FaceRecognition;