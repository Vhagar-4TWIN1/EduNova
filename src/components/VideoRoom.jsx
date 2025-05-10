import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import * as faceapi from "face-api.js";

const userName =
  localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");

function randomID(len) {
  let result = "";
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  const videoRef = useRef(null);
  const callContainerRef = useRef(null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const hasJoinedRef = useRef(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression"),
        ]);
        setModelsLoaded(true);
        console.log("Models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
        setModelsLoaded(false); // Handle model loading failure
      }
    };
    loadModels();
  }, []);

  // Start emotion detection when models are ready
  useEffect(() => {
    if (!modelsLoaded) return;

    const startEmotionDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user", // Ensure front camera
            width: 640, 
            height: 480 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure video plays even when hidden
          await videoRef.current.play();
          console.log("Webcam stream is active");
        }

        const detect = async () => {
          try {
            const options = new faceapi.TinyFaceDetectorOptions({
              inputSize: 512, // Higher resolution for better detection
              scoreThreshold: 0.5
            });

            const result = await faceapi
              .detectSingleFace(videoRef.current, options)
              .withFaceExpressions();

            if (result?.expressions) {
              const topEmotion = Object.entries(result.expressions).sort(
                (a, b) => b[1] - a[1]
              )[0][0];
              setCurrentEmotion(topEmotion);
            } else {
              console.log("No face detected");
            }
          } catch (error) {
            console.error("Detection error:", error);
          }
        };

        const interval = setInterval(detect, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Webcam error:", err);
      }
    };

    startEmotionDetection();
  }, [modelsLoaded]);

  // Rest of the component remains the same...
  // Setup Zego call once
  useEffect(() => {
    if (hasJoinedRef.current || !callContainerRef.current) return;

    const myMeeting = async () => {
      hasJoinedRef.current = true;

      const appID = 1725455389;
      const serverSecret = "8c8e1f05d3f6950fa2cd002221454752";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(5),
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: callContainerRef.current,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        showRoomTimer: true,
        showLeaveButton: true,
      });
    };

    myMeeting();
  }, [roomID]);

  return (
    <>
      {/* Zego Call Container */}
      <div
        className="myCallContainer"
        ref={callContainerRef}
        style={{ width: "100vw", height: "100vh" }}
      ></div>

      {/* Hidden Webcam for Face Detection */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />

      {/* Emotion Overlay */}
      {currentEmotion && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "18px",
            zIndex: 9999,
          }}
        >
          Emotion: <strong>{currentEmotion.toUpperCase()}</strong>
        </div>
      )}
    </>
  );
}
