import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const EmotionDetector = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Folder where models are hosted
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels().then(startVideo);
  }, []);

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const sorted = Object.entries(detections[0].expressions).sort(
          (a, b) => b[1] - a[1]
        );

        setEmotion(sorted[0][0]); // Get emotion with highest probability
      }

      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
    }, 500);
  };

  return (
    <div>
      <h2>Detected Emotion: {emotion || "Detecting..."}</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        onPlay={handleVideoOnPlay}
        style={{ border: "2px solid #ccc", borderRadius: "8px" }}
      />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0 }} />
    </div>
  );
};

export default EmotionDetector;
