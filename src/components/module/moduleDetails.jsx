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
  FaFilePdf,
  FaLink,
  FaHeading,
  FaFolderOpen,
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
      const isMoodleCourse = !isNaN(id);

      if (isMoodleCourse) {
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
        setLoading(false);
      } else {
        const [moduleRes, lessonRes, enrollmentRes, completedRes, userRes] =
          await Promise.all([
            axios.get(`http://localhost:3000/module/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }),
            axios.get(`http://localhost:3000/module/modules/${id}/lessons`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }),
            axios.get(
              `http://localhost:3000/api/progress/enrollment/${userId}/${id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            ),
            axios.get(
              `http://localhost:3000/api/progress/completed/${userId}/${id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            ),
            axios.get(`http://localhost:3000/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setModule(moduleRes.data);
        setLessons(lessonRes.data);
        setIsEnrolled(enrollmentRes.data.enrolled);
        setCompletedLessons(completedRes.data.completedLessons);
        setUserLearningPreference(
          userRes.data?.data?.learningPreference || "video"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching module data:", error);
      if (error.response?.status === 404) {
        navigate('/not-found');
      }
      setLoading(false);
    }
  };

  // Track lesson duration logic
  let lessonStartTime = Date.now();
  
  const trackDuration = async () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - lessonStartTime) / 1000);

    try {
      await axios.post("http://localhost:3000/module/check-lessons-duration", 
        { moduleId: id, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to track lesson duration:", error);
    }
  };

  window.addEventListener("beforeunload", trackDuration);

  fetchModuleLessons();

  return () => {
    trackDuration();
    window.removeEventListener("beforeunload", trackDuration);
  };
}, [id, userId, navigate, token]);

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
  const renderMoodleModuleIcon = (modname) => {
    switch (modname) {
      case 'resource':
        return <FaFilePdf className="module-icon" />;
      case 'url':
        return <FaLink className="module-icon" />;
      case 'label':
        return <FaHeading className="module-icon" />;
      case 'folder':
        return <FaFolderOpen className="module-icon" />;
      default:
        return <FaExternalLinkAlt className="module-icon" />;
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

      {/* Corrected section */}
      {!module.isMoodle && (
        <>
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
        </>
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
          </>
        )}
      </div>

      {module.isMoodle ? (
        <div className="moodle-lessons-section">
  <div className="section-header">
    <h2>
      <FaBook /> Contenu du cours
    </h2>
    <p className="moodle-course-info">
      {module.description && (
        <div className="moodle-description">
          {module.description.replace(/<[^>]+>/g, '')}
        </div>
      )}
    </p>
  </div>

  {moodleLessons.map((section, index) => (
    <div key={index} className="moodle-section">
      <div className="section-title">
        <h3>Section {index + 1}: {section.name}</h3>
        {section.summary && (
          <div className="section-description">
            {section.summary.replace(/<[^>]+>/g, '')}
          </div>
        )}
      </div>

      <div className="moodle-modules-grid">
        {section.modules.map((moodleModule, modIndex) => (
          <div
            key={modIndex}
            className={`moodle-module-card ${moodleModule.modname}`}
            onClick={() => moodleModule.url && openMoodleLesson(moodleModule.url)}
            style={{ cursor: moodleModule.url ? 'pointer' : 'default' }}
          >
            <div className="moodle-module-content">
              <div className="module-icon-container">
                {renderMoodleModuleIcon(moodleModule.modname)}
              </div>
              <div className="module-details">
                <h4>{moodleModule.name}</h4>
                <p className="module-type">{moodleModule.modname}</p>
                {moodleModule.description && (
                  <div className="module-description">
                    {moodleModule.description.replace(/<[^>]+>/g, '')}
                  </div>
                )}
              </div>
              {moodleModule.url && (
                <FaExternalLinkAlt className="external-link-icon" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


      ) : (
        isEnrolled && (
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
  .filter(lesson => {
    if (role === "Teacher") return true;
    if (!isEnrolled) return false;
    if (Array.isArray(userLearningPreference)) {
      return userLearningPreference
        .map(p => p.toLowerCase())
        .includes(lesson.typeLesson?.toLowerCase());
    }
    return lesson.typeLesson?.toLowerCase() === userLearningPreference?.toLowerCase();
  })
  .map(lesson => {
    const isCompleted = completedLessons.includes(lesson._id);
    return (
      <div
        key={lesson._id}
        className={`lesson-card ${isCompleted ? "completed" : ""}`}
        onClick={() => navigate("/lesson-details", { state: { lesson } })}
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
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteLesson(lesson._id);
                }}
                className="complete-button"
              >
                Mark as Completed
              </button>
            )}
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
          </div>
        )
      )}
    </div>
  );
};

export default ModuleDetails;

