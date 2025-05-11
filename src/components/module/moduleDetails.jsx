import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaBook,
  FaPlus,
  FaArrowLeft,
  FaLock,
  FaLockOpen,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

const ModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moodleLessons, setMoodleLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userRole, setUserRole] = useState("student");
  const [userLearningPreference, setUserLearningPreference] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
  const fetchModuleLessons = async () => {
    try {
      // Check if this is a Moodle course (numeric ID)
      const isMoodleCourse = !isNaN(id);

      if (isMoodleCourse) {
        // Fetch Moodle course content
        const moodleRes = await axios.get(
          "http://40.127.12.101/moodle/webservice/rest/server.php",
          {
            params: {
              wstoken: "46b0837fde05083b10edd2f210c2fbe7",
              wsfunction: "core_course_get_contents",
              courseid: id,
              moodlewsrestformat: "json",
            },
          }
        );

        setMoodleLessons(moodleRes.data);
        setModule({
          _id: id,
          title: `Moodle Course ${id}`,
          description: "Imported from Moodle",
          isMoodle: true
        });
      } else {
        // Fetch local module
          const [moduleRes, lessonRes, enrollmentRes, completedRes, userRes] =
          await Promise.all([
            axios.get(`http://localhost:3000/module/${id}`),
            axios.get(`http://localhost:3000/module/modules/${id}/lessons`),
            axios.get(
              `http://localhost:3000/api/progress/enrollment/${userId}/${id}`
            ),
            axios.get(
              `http://localhost:3000/api/progress/completed/${userId}/${id}`
            ),
            axios.get(`http://localhost:3000/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setModule(moduleRes.data);
        setLessons(lessonRes.data);
        setIsEnrolled(enrollmentRes.data.enrolled);
        setCompletedLessons(completedRes.data.completedLessons);

        const preference = userRes.data?.data?.learningPreference;
        setUserLearningPreference(preference || "video"); // fallback

        setLoading(false);
      } 
    } catch (error) {
      console.error("Error fetching module data:", error);
      // Handle specific error cases
      if (error.response?.status === 404) {
        navigate('/not-found');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchModuleLessons();
}, [id, userId, navigate]);

  const handleEnroll = async () => {
    try {
      await axios.post(`http://localhost:3000/api/progress/enroll`, {
        userId,
        moduleId: id,
      });
      setIsEnrolled(true);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await axios.post(`http://localhost:3000/api/progress/complete`, {
        userId,
        moduleId: id,
        lessonId,
      });
      setCompletedLessons((prev) => [...prev, lessonId]);
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:3000/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      setCompletedLessons((prev) => prev.filter((id) => id !== lessonId));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson. Please try again.");
    }
  };

  const openMoodleLesson = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading module content...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="not-found-container">
        <h2>Module Not Found</h2>
        <p>This module does not exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const totalLessons = lessons.length;
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="module-details-container">
      <div className="module-header">
        <h1>{module.title}</h1>
        <p className="module-description">{module.description}</p>

        {isEnrolled && (
          <div className="progress-container">
            <div className="progress-header">
              <FiActivity className="progress-icon" />
              <span>Your Progress</span>
              <span>
                {completedLessons.length}/{totalLessons} lessons
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-percentage">
              {progressPercentage}% Complete
            </span>
          </div>
        )}

        {!isEnrolled ? (
          <button onClick={handleEnroll} className="enroll-button">
            <FaLockOpen /> Enroll in Module
          </button>
        ) : (
          <div className="enrolled-badge">
            <FaLock /> Enrolled
          </div>
        )}
      </div>

      {isEnrolled && (
        <div className="lessons-section">
          <div className="section-header">
            <h2>
              <FaBook /> Lessons
            </h2>
            {role === "Teacher" && (
              <button
                onClick={() => navigate(`/create-lesson/${id}`)}
                className="add-lesson-button"
              >
                <FaPlus /> Add Lesson
              </button>
            )}
          </div>

          {lessons.length === 0 ? (
            <div className="empty-lessons">
              <p>No lessons available in this module yet.</p>
            </div>
          ) : (
            <div className="lessons-grid">
              {lessons
                .filter((lesson) =>
                  Array.isArray(userLearningPreference)
                    ? userLearningPreference
                        .map((p) => p.toLowerCase())
                        .includes(lesson.typeLesson?.toLowerCase())
                    : lesson.typeLesson?.toLowerCase() ===
                      userLearningPreference?.toLowerCase()
                )
                .map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson._id);
                  return (
                    <div
                      key={lesson._id}
                      className={`lesson-card ${isCompleted ? "completed" : ""}`}
                      onClick={() =>
                        navigate("/lesson-details", { state: { lesson } })
                      }
                    >
                      {lesson.fileUrl && (
                        <div className="lesson-image">
                          <img src={lesson.fileUrl} alt="lesson preview" />
                        </div>
                      )}
                      <div className="lesson-content">
                        <h3>{lesson.title}</h3>
                        <p className="lesson-type">{lesson.typeLesson}</p>
                        <p className="lesson-excerpt">
                          {lesson.content.substring(0, 100)}...
                        </p>

                        <div className="lesson-footer">
                          {isCompleted ? (
                            <span className="completed-badge">
                              <FaCheckCircle /> Completed
                            </span>
                          ) : isEnrolled ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteLesson(lesson._id);
                              }}
                              className="complete-button"
                            >
                              Mark as Completed
                            </button>
                          ) : null}

                          {role === "Teacher" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLesson(lesson._id);
                              }}
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
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleDetails;