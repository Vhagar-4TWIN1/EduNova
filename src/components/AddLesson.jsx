import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddLesson = () => {
  const { id: moduleId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    typeLesson: "pdf",
    LMScontent: "",
  });

  const [file, setFile] = useState(null);
  const [publicId, setPublicId] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("content", lessonData.content);
    formData.append("typeLesson", lessonData.typeLesson);
    formData.append("LMScontent", lessonData.LMScontent);
    formData.append("module", moduleId);
    formData.append("file", file);
    if (publicId) formData.append("public_id", publicId);

    try {
      await axios.post("http://localhost:3000/api/lessons", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Lesson added successfully!");
      navigate(`/moduleDetails/${moduleId}`);
    } catch (err) {
      console.error("❌ Error adding lesson:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Failed to add lesson. Please check your input.");
      }
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      marginTop: "2rem"
    }}>
      <h2 style={{
        color: "#2d3748",
        marginBottom: "1.5rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid #e2e8f0"
      }}>
        Add New Lesson
      </h2>
      
      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>Title</label>
          <input
            style={{
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            name="title"
            value={lessonData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>Content</label>
          <textarea
            style={{
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              minHeight: "120px",
              resize: "vertical",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            name="content"
            value={lessonData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>Type</label>
          <select
            style={{
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              backgroundColor: "white",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            name="typeLesson"
            value={lessonData.typeLesson}
            onChange={handleChange}
            required
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>Choose File</label>
          <input
            type="file"
            style={{
              padding: "0.5rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              transition: "border-color 0.2s"
            }}
            name="file"
            accept="application/pdf,video/*,image/*,audio/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>Public ID (optional)</label>
          <input
            style={{
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            name="public_id"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
          />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#4a5568"
          }}>LMS Content (optional)</label>
          <textarea
            style={{
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              minHeight: "80px",
              resize: "vertical",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            name="LMScontent"
            value={lessonData.LMScontent}
            onChange={handleChange}
          />
        </div>

        <div style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#38a169",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            Save Lesson
          </button>
          <button
            type="button"
            onClick={() => navigate(`/moduleDetails/${moduleId}`)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#e2e8f0",
              color: "#4a5568",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;