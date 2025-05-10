import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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

  const [formatFilter, setFormatFilter] = useState({
    pdf: true,
    video: true,
    image: true,
    audio: true,
  });

  const [selectedDate, setSelectedDate] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);

  const handleRecentFilterChange = () => {
    setRecentOnly((prev) => !prev);
  };

  const handleMineFilterChange = () => {
    setShowMineOnly((prev) => !prev);
  };
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

  const handleFormatFilterChange = (format) => {
    setFormatFilter((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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
    .filter((lesson) => {
      const matchType = typeFilter[lesson.typeLesson];
      const matchDate =
        !selectedDate ||
        new Date(lesson.createdAt).toISOString().slice(0, 10) === selectedDate;
      const matchCreator = !showMineOnly || lesson.userId === userId;
      const matchRecent =
        !recentOnly ||
        new Date(lesson.createdAt) >=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      return matchType && matchDate && matchCreator && matchRecent;
    })
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
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        paddingTop: "4rem",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          padding: "2rem 1.5rem",
          borderRight: "1px solid #e5e7eb",
          background: "#f9fafb",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* 🎯 Type Filter */}
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            🎯 Filter by Type
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.keys(typeFilter).map((type) => (
              <li key={type} style={{ marginBottom: "0.6rem" }}>
                <label
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={typeFilter[type]}
                    onChange={() => handleTypeFilterChange(type)}
                    style={{ marginRight: "0.6rem" }}
                  />
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textTransform: "capitalize",
                      color: "#374151",
                    }}
                  >
                    {type}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* 📅 Date Range Filter (placeholder) */}
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            📅 Date
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              width: "100%",
              fontSize: "0.9rem",
              color: "#374151",
            }}
          />
        </div>

        {/* 🧑 Created by Me Filter */}
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            🧑 Created by Me
          </h2>
          <label
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={showMineOnly}
              onChange={handleMineFilterChange}
              style={{ marginRight: "0.6rem" }}
            />
            <span style={{ fontSize: "0.9rem", color: "#374151" }}>
              Show only my lessons
            </span>
          </label>
        </div>

        {/* 🕒 Recently Added Filter */}
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            🕒 Recent Uploads
          </h2>
          <label
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={recentOnly}
              onChange={handleRecentFilterChange}
              style={{ marginRight: "0.6rem" }}
            />
            <span style={{ fontSize: "0.9rem", color: "#374151" }}>
              Last 7 days only
            </span>
          </label>
        </div>

        {/* ➕ Add Lesson */}
        {role === "Teacher" && (
          <button
            onClick={() => navigate("/create-lesson")}
            style={{
              marginTop: "auto",
              padding: "0.75rem 1.2rem",
              backgroundColor: "#4fa54f",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
              width: "100%",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d8a3d")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4fa54f")
            }
          >
            ➕ Add Lesson
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e3a8a" }}>
            📚 All Lessons
          </h1>
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            paddingTop: "2rem",
          }}
        >
          {sortedLessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() =>
                navigate("/lesson-details", {
                  state: {
                    lesson,
                    moduleId: lesson.moduleId || lesson.module || "",
                  },
                })
              }
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e5e7eb",
                borderRadius: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{
                  height: "220px",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={lesson.fileUrl || "/assets/img/default-course.jpg"}
                  alt="Lesson Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ padding: "1.5rem" }}>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                    lineHeight: "1.4",
                  }}
                >
                  {lesson.title}
                </h2>

                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#4b5563",
                    marginBottom: "0.25rem",
                  }}
                >
                  Type: <strong>{lesson.typeLesson.toUpperCase()}</strong>
                </p>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    lineHeight: "1.5",
                  }}
                >
                  {lesson.content.slice(0, 90)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;
