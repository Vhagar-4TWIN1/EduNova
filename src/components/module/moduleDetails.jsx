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
  FaTrash,
} from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const ModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userRole, setUserRole] = useState("student");
  const [error, setError] = useState(null);
  const location = useLocation();

  const isCourse = location.pathname.includes('course');
  const isMoodle = location.pathname.includes('moodle');
  const userId = "123";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => { 
    const fetchModuleLessons = async () => {
      if(isCourse) {
        const [moduleRes, lessonRes, enrollmentRes, completedRes] =
          await Promise.all([
            axios.get(`http://localhost:3000/module/${id}`),
            axios.get(`http://localhost:3000/module/modules/${id}/lessons`),
            axios.get(
              `http://localhost:3000/api/progress/enrollment/${userId}/${id}`
            ),
            axios.get(
              `http://localhost:3000/api/progress/completed/${userId}/${id}`
            ),
          ]);
          try {
            setModule(moduleRes.data);
            console.log("Module data:", moduleRes.data);  
            setLessons(lessonRes.data);
            console.log("Lessons data:", lessonRes.data);
            setIsEnrolled(enrollmentRes.data.enrolled);
            setCompletedLessons(completedRes.data.completedLessons);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching module lessons:", error);
            setLoading(false);
          }
      }
      else if (isMoodle) {
        try {
          const response = await axios.get("http://localhost/moodle/webservice/rest/server.php", {
            params: {
              wstoken: '7ccfd931c34a195d815957a0759ce508', // Replace with your valid token
              wsfunction: 'core_course_get_contents',
              courseid: id,
              moodlewsrestformat: 'json'
            }
          });
  
          // Process Moodle data
          const moodleData = response.data;
          if (moodleData && moodleData.length > 0) {
            // Extract relevant information to create a module object
            const firstSection = moodleData[0];
            const moodleModule = {
              title: firstSection.name || "Moodle Course",
              description: firstSection.summary || "Moodle course content",
              category: "Moodle",
              image: "https://via.placeholder.com/300x200?text=Moodle+Course",
              difficulty: "All Levels"
            };
            
            // Process sections and modules to create lessons array
            const moodleLessons = [];
            moodleData.forEach(section => {
              if (section.modules && section.modules.length > 0) {
                section.modules.forEach(mod => {
                  moodleLessons.push({
                    _id: mod.id,
                    title: mod.name,
                    typeLesson: mod.modname,
                    content: mod.description || "Moodle content",
                    
                    fileUrl:"https://www.edunao.com/app/uploads/2022/07/Moodle-Logo-sur-fond-gris-fafafa.webp"
                  });
                });
              }
              console.log("Moodle section data:", moodleLessons);
            });
            
            setModule(moodleModule);
            setLessons(moodleLessons);
            // For Moodle, we'll assume user is always "enrolled"
            setIsEnrolled(true);
          }
        } catch (error) {
          console.error("Error fetching Moodle lessons:", error);
          setError("Failed to load Moodle data.");
        } finally {
          setLoading(false);
        }
      }
    };
     
    fetchModuleLessons();
  }, [id]);

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

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:3000/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prevLessons) => {
        const updatedLessons = prevLessons.filter(
          (lesson) => lesson._id !== lessonId
        );
        const updatedCompleted = completedLessons.filter(
          (id) => id !== lessonId
        );
        setCompletedLessons(updatedCompleted);
        return updatedLessons;
      });
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson. Please try again.");
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
      console.error("Error marking as completed:", error);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading module content...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h2>Error Loading Content</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );

  if (!module)
    return (
      <div className="not-found-container">
        <h2>Module Not Found</h2>
        <p>
          The module you're looking for doesn't exist or may have been removed.
        </p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );

  const totalLessons = lessons.length;
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="module-details-container">
      <div className="module-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to {isMoodle ? "Courses" : "Modules"}
        </button>

        <div className="module-meta">
          <span className="module-category">
            {module.category || "General"}
          </span>
          <span className="module-difficulty">
            {module.difficulty || "All Levels"}
          </span>
        </div>

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

        {!isEnrolled && !isMoodle ? (
          <button onClick={handleEnroll} className="enroll-button">
            <FaLockOpen /> Enroll in Module
          </button>
        ) : isEnrolled ? (
          <div className="enrolled-badge">
            <FaLock /> Enrolled
          </div>
        ) : null}
      </div>

      <div className="lessons-section">
        <div className="section-header">
          <h2>
            <FaBook /> {isMoodle ? "Course Content" : "Lessons"}
          </h2>
          {role === "Teacher" && !isMoodle && (
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
            <p>No {isMoodle ? "content" : "lessons"} available in this {isMoodle ? "course" : "module"} yet.</p>
          </div>
        ) : (
          <div className="lessons-grid">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson._id);
              return (
                <div
                  key={lesson._id}
                  className={`lesson-card ${isCompleted ? "completed" : ""}`}
                  onClick={() => {
                    if (isMoodle) {
                      // For Moodle, open the URL directly
                      if (lesson.fileUrl) {
                        window.open(lesson.fileUrl, '_blank');
                      }
                    } else {
                      navigate("/lesson-details", { state: { lesson } });
                    }
                  }}
                >
                  {lesson.fileUrl && (
                    <div className="lesson-image">
                      <img 
                        src={lesson.fileUrl} 
                        alt="lesson preview" 
                      />
                    </div>
                  )}
                  <div className="lesson-content">
                    <h3>{lesson.title}</h3>
                    <p className="lesson-type">{lesson.typeLesson || "Moodle Content"}</p>
                    {!isMoodle && (
                      <p className="lesson-excerpt">
                        {lesson.content.substring(0, 100)}...
                      </p>
                    )}

                    <div className="lesson-footer">
                      {isCompleted ? (
                        <span className="completed-badge">
                          <FaCheckCircle /> Completed
                        </span>
                      ) : isEnrolled && !isMoodle ? (
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

                      {role === "Teacher" && !isMoodle && (
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
    </div>
  );
};

export default ModuleDetails;
