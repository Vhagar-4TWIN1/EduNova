import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import * as faceapi from "@vladmandic/face-api";

// Get user name from localStorage only when the component renders
const getUserName = () => {
  try {
    return (
      localStorage.getItem("firstName") +
        " " +
        localStorage.getItem("lastName") || "User"
    );
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return "User";
  }
};

function randomID(len) {
  let result = "";
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr || "");
}

export default function App() {
  // Get roomID once during initial render
  const roomID = React.useMemo(
    () => getUrlParams().get("roomID") || randomID(5),
    []
  );
  const videoContainerRef = useRef(null);
  const zegoInitialized = useRef(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionDetectionActive, setEmotionDetectionActive] = useState(false);
  const emotionIntervalRef = useRef(null);
  const videoElementRef = useRef(null);

  // Load Face-API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression"),
        ]);
        console.log("Face-API models loaded successfully");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };
    loadModels();

    return () => {
      // Cleanup emotion detection interval
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
    };
  }, []);

  // Setup emotion detection after models are loaded and video call is started
  useEffect(() => {
    if (
      !isModelLoaded ||
      !videoContainerRef.current ||
      !zegoInitialized.current
    )
      return;

    let findVideoAttempts = 0;
    const maxAttempts = 10;

    // Function to find the video element after Zego UI Kit is initialized
    const findVideoElement = () => {
      // Try to find the local video element inside the container
      const videoElements = videoContainerRef.current.querySelectorAll("video");

      // Log what we found for debugging
      if (findVideoAttempts === 0) {
        console.log(`Found ${videoElements.length} video elements`);
      }

      // Look for the local video (typically has attributes related to local stream)
      for (const videoEl of videoElements) {
        // Usually the local video has specific classes or attributes
        // This is a common pattern, but may need adjustment based on Zego's implementation
        if (
          videoEl.classList.contains("local") ||
          videoEl.getAttribute("data-local") === "true" ||
          videoEl.closest('[data-local="true"]') ||
          (videoEl.srcObject && videoEl.srcObject.id) ||
          videoElements.length === 1
        ) {
          // Fallback: if only one video, use that

          videoElementRef.current = videoEl;
          console.log("Found video element for emotion detection");
          startEmotionDetection();
          return;
        }
      }

      // If no suitable video found and we haven't exceeded maximum attempts
      findVideoAttempts++;
      if (findVideoAttempts < maxAttempts) {
        // If video element is not found immediately, try again after a delay
        setTimeout(findVideoElement, 1000);
      } else {
        console.warn(
          "Could not find suitable video element for emotion detection after multiple attempts"
        );
      }
    };

    // Start finding the video element with a slight delay to ensure Zego has initialized
    const initTimer = setTimeout(findVideoElement, 2000);

    return () => {
      clearTimeout(initTimer);
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
    };
  }, [isModelLoaded, zegoInitialized.current]);

  // Function to start emotion detection
  const startEmotionDetection = () => {
    if (!videoElementRef.current || !isModelLoaded) return;

    setEmotionDetectionActive(true);

    const detectEmotion = async () => {
      try {
        if (
          !videoElementRef.current ||
          videoElementRef.current.paused ||
          videoElementRef.current.ended
        ) {
          return;
        }

        const result = await faceapi
          .detectSingleFace(
            videoElementRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (result?.expressions) {
          const topEmotion = Object.entries(result.expressions).sort(
            (a, b) => b[1] - a[1]
          )[0][0];
          setCurrentEmotion(topEmotion);
        }
      } catch (error) {
        console.error("Error detecting emotion:", error);
      }
    };

    // Start detecting emotions at regular intervals
    emotionIntervalRef.current = setInterval(detectEmotion, 1000);
  };

  // Toggle emotion detection
  const toggleEmotionDetection = () => {
    if (emotionDetectionActive) {
      // Stop emotion detection
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
        emotionIntervalRef.current = null;
      }
      setEmotionDetectionActive(false);
      setCurrentEmotion(null);
    } else {
      // Start emotion detection
      startEmotionDetection();
    }
  };

  const myMeeting = React.useCallback(
    (element) => {
      // Prevent multiple initializations
      if (zegoInitialized.current || !element) return;

      // Store the element reference
      videoContainerRef.current = element;
      zegoInitialized.current = true;

      // IIFE to handle the async initialization
      (async () => {
        try {
          console.log("Initializing Zego meeting...");

          // Get userName here to ensure it's available
          const userName = getUserName();

          // generate Kit Token
          const appID = 1725455389;
          const serverSecret = "8c8e1f05d3f6950fa2cd002221454752";
          const userID = randomID(5);

          console.log(`Creating room with ID: ${roomID}, user: ${userName}`);

          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
          );

          // Create instance object from Kit Token.
          const zp = ZegoUIKitPrebuilt.create(kitToken);

          // start the call
          zp.joinRoom({
            container: element,
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
              mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls
            },
            showPreJoinView: false,
            showRoomTimer: true,
            showLeaveButton: true,
          });
        } catch (error) {
          console.error("Error initializing Zego meeting:", error);
          zegoInitialized.current = false; // Reset flag to allow retry
        }
      })();
    },
    [roomID]
  );

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100%", height: "100%" }}
      ></div>

      {/* Emotion Detection UI */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleEmotionDetection}
          style={{
            padding: "8px 16px",
            backgroundColor: emotionDetectionActive ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {emotionDetectionActive
            ? "Disable Emotion Detection"
            : "Enable Emotion Detection"}
        </button>

        {emotionDetectionActive && (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0" }}>Detected Emotion:</p>
            <h3 style={{ margin: "5px 0", fontWeight: "bold" }}>
              {currentEmotion ? currentEmotion.toUpperCase() : "Detecting..."}
            </h3>
          </div>
        )}

        {!isModelLoaded && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              className="spinner-border"
              role="status"
              style={{ width: "1rem", height: "1rem" }}
            ></div>
            <span>Loading emotion detection models...</span>
          </div>
        )}
      </div>
    </div>
  );
}
