import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("title");
  const [typeFilter, setTypeFilter] = useState({
    pdf: true,
    video: true,
    photo: true,
    audio: true,
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId"); 
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(res.data);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Unauthorized or server error.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchLessons();
    } else {
      setError("No token found. Please login.");
    }
  }, [token]);
  const trackPerformance = async (lessonId, lessonTitle, action) => {
    try {
      await axios.post(
        "http://localhost:3000/api/performance/performance-track",
        {
          userId,
          lessonId,
          lessonTitle,
          category: "lesson",
          action,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to track performance:", err);
    }
  };

  const handleViewFile = (lessonId, lessonTitle) => {
    trackPerformance(lessonId, lessonTitle, "view_file");
  };
  const sortedLessons = [...lessons]
    .filter((lesson) => typeFilter[lesson.typeLesson])
    .sort((a, b) => {
      if (sortOrder === "title") return a.title.localeCompare(b.title);
      if (sortOrder === "type") return a.typeLesson.localeCompare(b.typeLesson);
      return 0;
    });

  const handleDeleteLesson = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prev) => prev.filter((lesson) => lesson._id !== id));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson. Please try again.");
    }
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        paddingTop: "9rem",
      }}
    >
      <aside
        style={{
          width: "240px",
          padding: "2rem 1rem",
          borderRight: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          FILTER BY TYPE
        </h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            fontSize: "0.95rem",
            lineHeight: "2",
          }}
        >
          {Object.keys(typeFilter).map((type) => (
            <li key={type}>
              <label>
                <input
                  type="checkbox"
                  checked={typeFilter[type]}
                  onChange={() => handleTypeFilterChange(type)}
                  style={{ marginRight: "0.5rem" }}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </li>
          ))}
        </ul>

        {role === "Teacher" && (
          <button
            onClick={() => navigate("/create-lesson")}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            + Add Lesson
          </button>
        )}
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>All Lessons</h1>
          <div>
            <label htmlFor="sort" style={{ marginRight: "0.5rem" }}>
              Sort By:
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="title">Title</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          {sortedLessons.map((lesson) => (
            <div
              key={lesson._id}
              style={{
                display: "flex",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "130px",
                  height: "100px",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={lesson.fileUrl}
                  title="Lesson File"
                  width="100%"
                  height="100%"
                  style={{
                    borderRadius: "0.375rem",
                    border: "1px solid #ccc",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "0.25rem",
                  }}
                >
                  {lesson.title}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  Type: <strong>{lesson.typeLesson.toUpperCase()}</strong>
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  {lesson.content.slice(0, 80)}...
                </p>
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <button
                 onClick={() => {
                  handleViewFile(lesson._id, lesson.title);
                  navigate("/lesson-details", { state: { lesson } });
                }}
                

                    
                    style={{
                      backgroundColor: "#4ade80",
                      color: "white",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    🔍 View Details
                  </button>
                  <a
                    href={lesson.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "0.375rem",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      display: "inline-block",
                    }}
                  >
                    📂 View File
                  </a>
                  {role === "Teacher" && (
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;