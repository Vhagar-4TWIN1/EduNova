import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescriptor, setImageDescriptor] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };
    loadModels();
  }, []);

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    setSelectedImage(img.src);

    img.onload = async () => {
      const imageDetection = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();

      if (!imageDetection) {
        alert("No face detected in the selected image.");
        return;
      }

      setImageDescriptor(imageDetection.descriptor);
      alert("Image loaded successfully! Now capture from the webcam.");
    };
  };

  const compareFaceWithImage = async () => {
    if (!videoRef.current || !imageDescriptor) {
      alert("Please select an image first!");
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
    if (distance < similarityThreshold) {
      alert("✅ Match Found! The face matches the selected image.");
    } else {
      alert("❌ No Match. The face does not match the selected image.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-3">Face Recognition System</h2>

      {/* Image Upload Section */}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-3" />
      {selectedImage && <img src={selectedImage} alt="Selected" width="200" className="mt-2 border rounded" />}

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
      <button className="btn btn-primary mt-3" onClick={compareFaceWithImage}>
        Compare Face with Selected Image
      </button>
    </div>
  );
};

export default FaceRecognition;
