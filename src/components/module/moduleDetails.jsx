import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudySessionTracker from '../StudySessionTracker';
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
const [supplementaryLessons, setSupplementaryLessons] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
const [showSupplementary, setShowSupplementary] = useState(false);
const [timeSpent, setTimeSpent] = useState(0);
const requiredTime = 60;


useEffect(() => {
  if (!module?._id || role !== 'Student') return;

  const timer = setInterval(() => {
    setTimeSpent(prev => {
      const newTime = prev + 1;
      if (newTime >= requiredTime && !showSupplementary) {
        setShowSupplementary(true);
      }
      return newTime;
    });
  }, 1000); // Mise à jour chaque seconde

  return () => clearInterval(timer);
}, [module?._id, role, showSupplementary]);

useEffect(() => {
  let isMounted = true; // Ajout pour gérer le montage/démontage

  const fetchSupplementaryLessons = async () => {
    try {
      console.log("Début de la récupération des leçons supplémentaires");
      const response = await axios.get(
        `http://localhost:3000/api/study/recommendations/${module._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: AbortController.signal // Ajout pour annuler la requête
        }
      );
      
      if (!isMounted) return; // Ne pas mettre à jour si démonté
      
      console.log("Réponse reçue:", response.data);
      
      if (response.data && response.data.lessons) {
        console.log("Leçons trouvées:", response.data.lessons.length);
        setSupplementaryLessons(response.data.lessons);
      } else {
        console.warn("Structure de données inattendue:", response.data);
      }
    } catch (err) {
      if (err.name !== 'AbortError') { // Ne pas logger les erreurs d'annulation
        console.error("Erreur complète:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    }
  };
  
  if (module?._id) {
    fetchSupplementaryLessons();
  }

  return () => {
    isMounted = false; // Cleanup
    // Annuler les requêtes en cours si besoin
  };
}, [module?._id]); // Dépendance plus spécifique

// Add this handler for deleting supplementary lessons
const handleDeleteSupplementary = async (id) => {
  if (!window.confirm('Are you sure you want to delete this supplementary lesson?')) return;
  
  try {
    await axios.delete(`http://localhost:3000/api/study/recommendations/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setSupplementaryLessons(prev => prev.filter(lesson => lesson._id !== id));
  } catch (err) {
    console.error('Error deleting supplementary lesson:', err);
  }
};


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
        const [moduleRes, lessonRes, enrollmentRes, completedRes] =
          await Promise.all([
            axios.get(`http://localhost:3000/module/${id}`),
            axios.get(`http://localhost:3000/module/modules/${id}/lessons`),
            axios.get(`http://localhost:3000/api/progress/enrollment/${userId}/${id}`),
            axios.get(`http://localhost:3000/api/progress/completed/${userId}/${id}`),
          ]);

        setModule(moduleRes.data);
        setLessons(lessonRes.data);
        setIsEnrolled(enrollmentRes.data?.enrolled || false);
        setCompletedLessons(completedRes.data?.completedLessons || []);
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
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Modules
        </button>

        <div className="module-meta">
          <span className="module-category">{module.category || "General"}</span>
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






{role === 'Student' && showSupplementary && supplementaryLessons.length > 0 && (
  <div className="supplementary-section">
      <div className="time-progress">
    <p>Les ressources supplémentaires seront disponibles dans {requiredTime - timeSpent} secondes</p>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${(timeSpent/requiredTime)*100}%` }}
      ></div>
    </div>
  </div>
    <h3 style={{ margin: '20px 0 10px', color: '#3a0ca3' }}>
      <FaBook style={{ marginRight: '8px' }} />
      Supplementary Resources
    </h3>
    
    <div className="supplementary-grid">
      {supplementaryLessons.map(lesson => (
        <div key={lesson._id} className="supplementary-card">
          <div className="supplementary-content">
            <h4>{lesson.title}</h4>
            <p>{lesson.content || lesson.description || 'No content available'}</p>
            {lesson.resourceUrl && (
              <a 
                href={lesson.resourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                <FaExternalLinkAlt /> View Resource
              </a>
            )}
          </div>
          {role === "Teacher" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSupplementary(lesson._id);
              }}
              className="delete-button"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        {lessons.length === 0 && moodleLessons.length === 0 ? (
          <div className="empty-lessons">
            <p>No lessons available in this module yet.</p>
          </div>
        ) : (
          <>
            {lessons.length > 0 && (
              <div className="lessons-grid">
                {lessons.map((lesson) => {
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
                              className="delete-button"
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

            {moodleLessons.length > 0 && (
              <div className="moodle-lessons-section">
                <h2>
                  <FaBook /> Moodle Content
                </h2>
                <div className="moodle-sections">
                  {moodleLessons.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} className="moodle-section">
                      {section.name && (
                        <h3 className="moodle-section-title">{section.name}</h3>
                      )}
                      <div className="moodle-lessons-grid">
                        {section.modules.map((mod, modIndex) => (
                          <div 
                            key={`mod-${sectionIndex}-${modIndex}`} 
                            className="moodle-lesson-card"
                            onClick={() => mod.url && openMoodleLesson(mod.url)}
                          >
                            <div className="moodle-lesson-icon">
                              {mod.modicon && (
                                <img 
                                  src={mod.modicon} 
                                  alt={mod.modname} 
                                  onError={(e) => {
                                    e.target.src = "/static/default-moodle-icon.png";
                                  }}
                                />
                              )}
                            </div>
                            <div className="moodle-lesson-content">
                              <h4>{mod.name}</h4>
                              {mod.description && (
                                <div 
                                  className="moodle-lesson-description" 
                                  dangerouslySetInnerHTML={{ __html: mod.description }}
                                />
                              )}
                            </div>
                            {mod.url && (
                              <div className="moodle-lesson-action">
                                <FaExternalLinkAlt />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .module-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .module-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #4361ee;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        
        .module-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .module-description {
          color: #555;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .progress-container {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .progress-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          margin: 0.5rem 0;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #4361ee;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-percentage {
          font-size: 0.8rem;
          color: #666;
        }
        
        .enroll-button {
          background: #4361ee;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .enroll-button:hover {
          background: #3a0ca3;
        }
        
        .enrolled-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #e9ecef;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }
        
        .add-lesson-button {
          background: #4361ee;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .lessons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .lesson-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        
        .lesson-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .lesson-card.completed {
          border-left: 4px solid #4caf50;
        }
        
        .lesson-image {
          height: 160px;
          overflow: hidden;
        }
        
        .lesson-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .lesson-content {
          padding: 1rem;
        }
        
        .lesson-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }
        
        .lesson-type {
          color: #4361ee;
          font-size: 0.8rem;
          margin: 0 0 0.5rem;
          font-weight: 500;
        }
        
        .lesson-excerpt {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 1rem;
        }
        
        .lesson-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .completed-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #4caf50;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .complete-button {
          background: #f0f4ff;
          color: #4361ee;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .delete-button {
          background: #ef4444;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .moodle-lessons-section {
          margin-top: 3rem;
        }
        
        .moodle-sections {
          margin-top: 1.5rem;
        }
        
        .moodle-section {
          margin-bottom: 2rem;
        }
        
        .moodle-section-title {
          color: #555;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .moodle-lessons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .moodle-lesson-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .moodle-lesson-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .moodle-lesson-icon img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
        
        .moodle-lesson-content {
          flex: 1;
        }
        
        .moodle-lesson-content h4 {
          margin: 0 0 0.3rem;
          font-size: 1rem;
        }
        
        .moodle-lesson-description {
          font-size: 0.8rem;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .moodle-lesson-action {
          color: #4361ee;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4361ee;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .not-found-container {
          text-align: center;
          padding: 2rem;
        }
        
        .empty-lessons {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ModuleDetails;

