import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLesson = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    typeLesson: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [usedSuggestions, setUsedSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [rateLimited, setRateLimited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
  };

  const handleGetSuggestion = async () => {
    if (!lesson.title.trim()) return;
    try {
      setLoadingSuggestion(true);
      setRateLimited(false);
      const res = await axios.post("http://localhost:3000/api/ai/suggest", {
        title: lesson.title,
        used: usedSuggestions,
      });

      if (res.data?.suggestion) {
        const suggestion = res.data.suggestion.trim();
        if (!usedSuggestions.includes(suggestion)) {
          setCurrentSuggestion(suggestion);
          setUsedSuggestions((prev) => [...prev, suggestion]);
        } else {
          setCurrentSuggestion("❌ No new suggestion found.");
        }
      } else {
        setCurrentSuggestion("❌ No new suggestion found.");
      }
    } catch (error) {
      console.error("AI Suggest Error:", error);
      if (error.response?.status === 429) {
        setRateLimited(true);
        setCurrentSuggestion(
          "❌ Too many requests. Please wait a few seconds."
        );
      } else if (error.response?.status === 500) {
        setCurrentSuggestion(
          "❌ AI server error. Please check your backend logs."
        );
      } else {
        setCurrentSuggestion("❌ Failed to get suggestion.");
      }
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (currentSuggestion && !currentSuggestion.startsWith("❌")) {
      setLesson({ ...lesson, content: currentSuggestion });
      setCurrentSuggestion(null);
    }
  };

  const handleFileChange = (e) => {
    setLesson({ ...lesson, file: e.target.files[0] });
  };

  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dcf7pbfes/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edunova_preset");
    const res = await axios.post(url, formData);
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const upload = await uploadToCloudinary(lesson.file);

      await axios.post(
        "http://localhost:3000/api/lessons",
        {
          title: lesson.title,
          content: lesson.content,
          typeLesson: lesson.typeLesson,
          fileUrl: upload.secure_url,
          public_id: upload.public_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("✅ Lesson created successfully! 🚀");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/lesson");
      }, 2000);
    } catch (error) {
      console.error("Lesson creation failed:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        paddingTop: "6rem",
        paddingBottom: "4rem",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#ffffff",
          padding: "3rem 3rem 2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
          borderTop: "6px solid #5DDB91",
          margin: "0 1rem",
        }}
      >
        {successMessage && (
          <div
            style={{
              position: "fixed",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#d1fae5",
              color: "#065f46",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "1.05rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            {successMessage}
          </div>
        )}

        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            textAlign: "center",
            color: "#34d399",
          }}
        >
          📚 Create a New Lesson
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label style={labelStyle}>Lesson Title</label>
            <input
              type="text"
              name="title"
              value={lesson.title}
              onChange={handleChange}
              required
              placeholder="e.g. JavaScript Basics"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Lesson Content</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="button"
                onClick={handleGetSuggestion}
                disabled={
                  loadingSuggestion || !lesson.title.trim() || rateLimited
                }
                style={{
                  backgroundColor: rateLimited ? "#f87171" : "#3b82f6",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: rateLimited ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {loadingSuggestion
                  ? "Generating..."
                  : rateLimited
                  ? "⏳ Please wait..."
                  : "✨ Suggest Content"}
              </button>
              {currentSuggestion && !currentSuggestion.startsWith("❌") && (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptSuggestion}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    ✅ Accept
                  </button>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    Suggestion: {currentSuggestion.slice(0, 60)}...
                  </span>
                </>
              )}
              {currentSuggestion && currentSuggestion.startsWith("❌") && (
                <span style={{ fontSize: "0.85rem", color: "#b91c1c" }}>
                  {currentSuggestion}
                </span>
              )}
            </div>
            <textarea
              name="content"
              value={lesson.content}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Short summary or description..."
              style={{
                ...inputStyle,
                resize: "vertical",
                height: "120px",
                marginTop: "0.75rem",
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Type of Lesson</label>
            <select
              name="typeLesson"
              value={lesson.typeLesson}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">-- Select Type --</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="photo">Photo</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Upload File</label>
            <input
              type="file"
              accept="video/*,image/*,application/pdf,audio/*"
              onChange={handleFileChange}
              required
              style={{
                ...inputStyle,
                padding: "0.55rem",
                backgroundColor: "#f1f5f9",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              backgroundColor: uploading ? "#9ca3af" : "#5DDB91",
              color: "white",
              fontWeight: "600",
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
              transition: "0.3s all ease-in-out",
              boxShadow: uploading
                ? "none"
                : "0 4px 14px rgba(93, 219, 145, 0.3)",
            }}
          >
            {uploading ? "Uploading..." : "🚀 Submit Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 🌿 Shared Styles
const inputStyle = {
  width: "100%",
  padding: "0.9rem",
  fontSize: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.6rem",
  fontWeight: "600",
  fontSize: "1rem",
  color: "#374151",
};

export default CreateLesson;
