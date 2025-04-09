import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";

const FaceRecognition = () => {
  const navigate = useNavigate(); // Get navigate function

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [storedImage, setStoredImage] = useState(null);
  const [imageDescriptor, setImageDescriptor] = useState(null);

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
  }, []);

  // Start webcam when models are loaded
  useEffect(() => {
    if (!isModelLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();
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
    const dataURL = await fetchImageAsDataURL(imageUrl);
    if (!dataURL) {
      alert("Failed to load image from localStorage.");
      return;
    }

    const img = new Image();
    img.src = dataURL;
    console.log("Image loaded as Data URL:", img.src);

    img.onload = async () => {
      const imageDetection = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();

      if (!imageDetection) {
        alert("No face detected in the stored image.");
        return;
      }

      setImageDescriptor(imageDetection.descriptor);
      console.log("Stored image descriptor:", imageDetection.descriptor);
      console.log("Stored image processed successfully!");
    };
  };

  // Load image from localStorage and process it
  useEffect(() => {
    const storedImageUrl = localStorage.getItem("image");
    console.log("Stored image URL:", storedImageUrl);
    if (storedImageUrl) {
      setStoredImage(storedImageUrl);
      processStoredImage(storedImageUrl);
    } else {
      alert("No stored profile image found. Please upload one.");
    }
  }, []);
  // Compare live camera feed with stored image
  const compareFaceWithStoredImage = async () => {
    if (!videoRef.current || !imageDescriptor) {
      alert("No profile image found or not processed yet.");
      return;
    }

    // Detect face from webcam
    const webcamDetection = await faceapi.detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (!webcamDetection) {
      alert("No face detected in the webcam.");
      return;
    }

    const webcamDescriptor = webcamDetection.descriptor;

    // Compare descriptors using Euclidean distance
    const distance = faceapi.euclideanDistance(webcamDescriptor, imageDescriptor);
    console.log("Euclidean Distance:", distance);

    const similarityThreshold = 0.5; // Adjust as needed
    const role = localStorage.getItem("role");
    if (distance < similarityThreshold) {
      alert("✅ Match Found! The face matches the stored profile image.");
      if (role === 'Admin') {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }

    } else {
      alert("❌ No Match. The face does not match the stored image.");
      localStorage.removeItem("token");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("image");
      navigate("/");

    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-3">Face Recognition System</h2>

      {/* Display Stored Image */}
      {storedImage ? (
        <div>
          <h5>Stored Profile Image</h5>
          <img src={storedImage} alt="Stored Profile" width="200" className="mt-2 border rounded" />
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

      {!isModelLoaded && <p className="text-danger mt-3">Loading models...</p>}

      {/* Compare Faces Button */}
      <button className="btn btn-primary mt-3" onClick={compareFaceWithStoredImage}>
        Compare Face with Stored Image
      </button>
    </div>
  );
};

export default FaceRecognition;
