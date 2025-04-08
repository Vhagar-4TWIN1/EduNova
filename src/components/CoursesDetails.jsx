import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LessonDetailsFront = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson } = location.state || {};

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel(); // Stop previous speech
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  if (!lesson) {
    return (
      <div style={{ padding: "6rem 2rem" }}>
        <h2 style={{ color: "#ef4444" }}>No lesson data found.</h2>
        <button
          onClick={() => navigate("/lesson")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Lessons
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: "6rem",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "1rem",
          padding: "2.5rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937" }}>
          📘 {lesson.title}
        </h1>

        <p style={{ margin: "1rem 0", color: "#4b5563", fontSize: "1rem" }}>
          <strong>Type:</strong> {lesson.typeLesson.toUpperCase()}
        </p>

        <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
          {lesson.content}
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <iframe
            src={lesson.fileUrl}
            title="Lesson Preview"
            width="100%"
            height="400px"
            style={{ border: "1px solid #ccc", borderRadius: "0.5rem" }}
          />
          <button
            onClick={() => speakText(lesson.content)}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.6rem 1.2rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            🔊 Read Aloud
          </button>
          <button
            onClick={stopSpeech}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "0.6rem 1.2rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔇 Stop Reading
          </button>
        </div>

        <button
          onClick={() => navigate("/lesson")}
          style={{
            backgroundColor: "#4ade80",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Lessons
        </button>
      </div>
    </div>
  );
};

export default LessonDetailsFront;
