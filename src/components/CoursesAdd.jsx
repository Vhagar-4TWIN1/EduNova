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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
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
        "https://edunova-back-rqxc.onrender.com/api/lessons",
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
        paddingTop: "9rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* ✅ Success Message Banner */}
      {successMessage && (
        <div
          style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "9rem",
            borderRadius: "0.75rem",
            textAlign: "center",
            fontWeight: 600,
            margin: "0 auto 1rem",
            maxWidth: "650px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {successMessage}
        </div>
      )}

      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.07)",
          borderTop: "4px solid #5DDB91",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#4ade80",
          }}
        >
          📚 Create New Lesson
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label style={labelStyle}>Lesson Title</label>
            <input
              type="text"
              name="title"
              value={lesson.title}
              onChange={handleChange}
              required
              placeholder="Enter lesson title"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Lesson Content</label>
            <textarea
              name="content"
              value={lesson.content}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Brief description or summary"
              style={{ ...inputStyle, resize: "vertical" }}
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
              <option value="">Select type</option>
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
                padding: "0.5rem",
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
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              transition: "0.3s all ease-in-out",
              boxShadow: uploading
                ? "none"
                : "0 2px 8px rgba(93, 219, 145, 0.4)",
            }}
          >
            {uploading ? "Uploading..." : "🚀 Submit Lesson"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 🌱 Styles
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  fontSize: "0.95rem",
  color: "#374151",
};

export default CreateLesson;
