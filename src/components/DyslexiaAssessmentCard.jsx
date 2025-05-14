import React, { useState, useRef } from "react";
import axios from "axios";

const DyslexiaAssessmentCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const [dyslexiaLevel, setDyslexiaLevel] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");

  const phrases = [
    "She sells sea shells by the sea shore.",
    "The big black bug bit the big black bear.",
    "Red lorry, yellow lorry.",
    "Unique New York.",
    "Peter Piper picked a peck of pickled peppers.",
  ];

  const calculateSimilarity = (expected, actual) => {
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z ]/g, "")
        .trim();
    const a = normalize(expected).split(" ");
    const b = normalize(actual).split(" ");
    let matchCount = 0;
    a.forEach((word, i) => {
      if (b[i] && word === b[i]) matchCount++;
    });
    return matchCount / a.length;
  };

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = async (event) => {
      const spoken = event.results[0][0].transcript;
      setTranscript(spoken);

      const similarity = calculateSimilarity(phrases[currentIndex], spoken);
      let difficulty = 1;
      if (similarity < 0.3) difficulty = 3;
      else if (similarity < 0.7) difficulty = 2;

      const updatedResponses = [...responses, difficulty];
      setResponses(updatedResponses);

      if (currentIndex < phrases.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
        evaluateDyslexiaLevel(updatedResponses);
        await getAIInsight(spoken);
      }
    };
    recognition.onerror = (event) => {
      alert("Error during speech recognition: " + event.error);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const evaluateDyslexiaLevel = (scores) => {
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (averageScore < 1.5) {
      setDyslexiaLevel("Low signs of dyslexia");
    } else if (averageScore < 2.5) {
      setDyslexiaLevel("Moderate signs of dyslexia");
    } else {
      setDyslexiaLevel("Strong signs of dyslexia");
    }
  };

  const getAIInsight = async (text) => {
    try {
      const response = await axios.post(
        "https://edunova-back-rqxc.onrender.com/api/ai/dyslexia-feedback",
        {
          transcript: text,
        }
      );
      setAiFeedback(response.data.feedback);
    } catch (err) {
      console.error("AI feedback error:", err);
      setAiFeedback("AI feedback unavailable.");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #fff7ed, #e0f2fe)",
        borderRadius: "1rem",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          color: "#1e3a8a",
          marginBottom: "1rem",
        }}
      >
        🧠 Dyslexia Screening Task
      </h2>
      {!finished ? (
        <>
          <p
            style={{ fontSize: "1rem", color: "#374151", marginBottom: "1rem" }}
          >
            Try reading the following phrase aloud. The AI will analyze your
            speech:
          </p>
          <blockquote
            style={{
              fontSize: "1.25rem",
              fontWeight: "500",
              color: "#111827",
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {phrases[currentIndex]}
          </blockquote>
          <button
            type="button" // ⬅️ Add this line!
            onClick={startRecognition}
            style={{
              marginBottom: "1rem",
              backgroundColor: "#60a5fa",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              color: "white",
            }}
          >
            🎙 Start Speaking
          </button>
          <p style={{ marginBottom: "1rem", color: "#1f2937" }}>
            <strong>Your speech:</strong> {transcript || "(waiting...)"}
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "1rem", color: "#374151" }}>
            <strong>Assessment Result:</strong>
          </p>
          <p
            style={{
              color: "#1f2937",
              fontSize: "1.2rem",
              fontWeight: "500",
              marginTop: "0.5rem",
            }}
          >
            {dyslexiaLevel}
          </p>
          <p style={{ marginTop: "1rem", color: "#334155" }}>
            <strong>AI Feedback:</strong> {aiFeedback}
          </p>
        </>
      )}
    </div>
  );
};

export default DyslexiaAssessmentCard;
