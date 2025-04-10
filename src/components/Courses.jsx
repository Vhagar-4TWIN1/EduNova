import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const userId = localStorage.getItem("userId"); // Make sure userId is stored on login
  const role = localStorage.getItem("role");
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
      {/* ... existing aside and main structure ... */}

      <main style={{ flex: 1, padding: "2rem" }}>
        {/* ... existing header and filter UI ... */}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {sortedLessons.map((lesson) => (
            <div key={lesson._id} >
              {/* ... existing lesson card content ... */}
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleViewFile(lesson._id, lesson.title)}
                
              >
                📂 View File
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;