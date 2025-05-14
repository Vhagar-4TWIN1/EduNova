import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudySessionTracker from "../StudySessionTracker";
import { FaQuestionCircle, FaPodcast } from "react-icons/fa";
import { FaYoutube, FaFileAlt, FaRunning } from "react-icons/fa";

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
  const [totalLessons, setTotalLessons] = useState(0);
const [showSupplementary, setShowSupplementary] = useState(() => {
  try {
    return localStorage.getItem(`showSupplementary_${id}`) === 'true';
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return false;
  }
});
  const [timeSpent, setTimeSpent] = useState(0);
  const requiredTime = 60;

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!module?._id || role !== 'Student') return;
  if (showSupplementary) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (newTime >= requiredTime && !showSupplementary) {
          setShowSupplementary(true);
            localStorage.setItem(`showSupplementary_${id}`, 'true');
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [module?._id, role, showSupplementary , id]);

  useEffect(() => {
    let isMounted = true;

    const fetchSupplementaryLessons = async () => {
      console.log("Supplementary Lessons:", supplementaryLessons);

      try {
        const response = await axios.get(
          `https://edunova-back-rqxc.onrender.com/api/study/recommendations/${module._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        
        if (!isMounted) return;
        
        if (response.data && response.data.lessons) {
          setSupplementaryLessons(response.data.lessons);
        } else {
          console.warn("Structure de données inattendue:", response.data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
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
      isMounted = false;
    };
  }, [module?._id]);

  const handleDeleteSupplementary = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplementary lesson?')) return;
    
    try {
      await axios.delete(`https://edunova-back-rqxc.onrender.com/api/study/recommendations/${id}`, {
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
        const savedShowSupplementary = localStorage.getItem(`showSupplementary_${id}`) === 'true';
        if (savedShowSupplementary) {
          setShowSupplementary(true);
        }

        const isMoodleCourse = !isNaN(id);

        if (isMoodleCourse) {
          const moodleRes = await axios.get(
            "http://edunova.moodlecloud.com/moodle/webservice/rest/server.php",
            {
              params: {
                wstoken: "aeb753af3b7400cf5a7d4d8f3ce5a950",
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
            isMoodle: true,
          });
          setLoading(false);
        } else {
          const [moduleRes, lessonRes, enrollmentRes, completedRes, userRes] =
            await Promise.all([
              axios.get(`https://edunova-back-rqxc.onrender.com/module/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }),
              axios.get(`https://edunova-back-rqxc.onrender.com/module/modules/${id}/lessons`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }),
              axios.get(
                `https://edunova-back-rqxc.onrender.com/api/progress/enrollment/${userId}/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              ),
              axios.get(
                `https://edunova-back-rqxc.onrender.com/api/progress/completed/${userId}/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              ),
              axios.get(`https://edunova-back-rqxc.onrender.com/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

          setModule(moduleRes.data);
          setLessons(lessonRes.data);
          const preferredLessons = lessonRes.data.filter((lesson) => {
            if (Array.isArray(userRes.data?.data?.learningPreference)) {
              return userRes.data.data.learningPreference
                .map((p) => p.toLowerCase())
                .includes(lesson.typeLesson?.toLowerCase());
            }
            return (
              lesson.typeLesson?.toLowerCase() ===
              userRes.data?.data?.learningPreference?.toLowerCase()
            );
          });

          setTotalLessons(preferredLessons.length);

          const completedPreferred = preferredLessons.filter((lesson) =>
            completedRes.data.completedLessons.includes(lesson._id)
          );

          setCompletedLessons(completedPreferred.map((l) => l._id));

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
          navigate("/not-found");
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
        await axios.post(
          "https://edunova-back-rqxc.onrender.com/module/check-lessons-duration",
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
      await axios.post(`https://edunova-back-rqxc.onrender.com/api/progress/enroll`, {
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
      case "resource":
        return <FaFilePdf className="module-icon" />;
      case "url":
        return <FaLink className="module-icon" />;
      case "label":
        return <FaHeading className="module-icon" />;
      case "folder":
        return <FaFolderOpen className="module-icon" />;
      default:
        return <FaExternalLinkAlt className="module-icon" />;
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await axios.post(`https://edunova-back-rqxc.onrender.com/api/progress/complete`, {
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
      await axios.delete(`https://edunova-back-rqxc.onrender.com/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      setCompletedLessons((prev) => prev.filter((id) => id !== lessonId));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson. Please try again.");
    }
  };

const renderSupplementaryIcon = (type) => {
  switch(type) {
    case 'video':
      return <FaYoutube className="text-red-500 mr-2" />;
    case 'article':
      return <FaFileAlt className="text-blue-500 mr-2" />;
    case 'exercise':
      return <FaRunning className="text-green-500 mr-2" />;
    case 'quiz':
      return <FaQuestionCircle className="text-yellow-500 mr-2" />;
    case 'podcast':
      return <FaPodcast className="text-purple-500 mr-2" />;
    case 'pdf':
      return <FaFilePdf className="text-red-500 mr-2" />;
    default:
      return <FaExternalLinkAlt className="text-gray-500 mr-2" />;
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

  //const totalLessons = lessons.length;
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="module-details-container">
      <div className="module-header">
        <h1>{module.title}</h1>
        <p className="module-description">{module.description}</p>

        {!module.isMoodle && role !== "Teacher" && (
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

      <div className="lessons-and-supplementary-container">
        {/* Main Lessons Section */}
        {module.isMoodle ? (
          <div className="moodle-lessons-section">
            <div className="section-header">
              <h2><FaBook /> Contenu du cours</h2>
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
                <h2><FaBook /> Lessons</h2>
                {role === "Teacher" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/create-lesson/${id}`)}
                      className="add-lesson-button"
                    >
                      <FaPlus /> Add Lesson
                    </button>
                    <button
                      onClick={() => navigate(`/add-supplementary-lesson/${id}`)}
                      className="add-lesson-button bg-purple-600 hover:bg-purple-700"
                    >
                      <FaPlus /> Add Supplementary Lesson
                    </button>
                  </div>
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

        {/* Supplementary Resources Section */}
        {!module.isMoodle && role === 'Student' && showSupplementary && supplementaryLessons.length > 0 && (
          <div className="supplementary-section mt-8">
            <div className="time-progress mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {timeSpent >= requiredTime 
                    ? 'Supplementary resources unlocked' 
                    : 'Unlocking supplementary resources...'}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.min(timeSpent, requiredTime)}/{requiredTime}s
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    timeSpent >= requiredTime ? 'bg-green-500' : 'bg-blue-600'
                  }`} 
                  style={{ width: `${(Math.min(timeSpent, requiredTime)/requiredTime)*100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="section-header">
              <h2 className="supplementary-title">
                <FaBook className="mr-2" />
                Supplementary Resources
              </h2>
              <button 
    onClick={() => {
      const newState = !showSupplementary;
      setShowSupplementary(newState);
      localStorage.setItem(`showSupplementary_${id}`, String(newState));
    }}
    className="text-sm text-blue-600 hover:text-blue-800"
  >
    {showSupplementary ? 'Hide' : 'Show'}
  </button>
            </div>
            
         <div className="supplementary-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {supplementaryLessons.map(lesson => (
    <div key={lesson._id} className={`supplementary-card rounded-lg shadow-md p-4 ${
      lesson.type === 'video' ? 'border-l-4 border-red-500' :
      lesson.type === 'article' ? 'border-l-4 border-blue-500' :
      lesson.type === 'exercise' ? 'border-l-4 border-green-500' :
      'border-l-4 border-purple-500'
    }`}>
      <div className="supplementary-content">
        <div className="flex items-center mb-2">
          {renderSupplementaryIcon(lesson.type)}
          <h4 className="font-semibold">{lesson.title}</h4>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-xs ${
            lesson.type === 'video' ? 'bg-red-100 text-red-800' :
            lesson.type === 'article' ? 'bg-blue-100 text-blue-800' :
            lesson.type === 'exercise' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
          </span>
          {lesson.duration > 0 && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
              {lesson.duration} min
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-3 text-sm">
          {lesson.content || lesson.description || 'No content available'}
        </p>
        
       {lesson.resourceUrl && (
  <div className="mt-auto">
  {lesson.type === 'pdf' ? (
  <a 
  href={`https://edunova-back-rqxc.onrender.com/pdf/${lesson.filePath}`} 
  download={lesson.originalFileName || `${lesson.title.replace(/\s+/g, '_')}.pdf`}
  className="inline-flex items-center px-3 py-1 rounded text-sm bg-red-50 text-red-700 hover:bg-red-100"
  onClick={(e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = `https://edunova-back-rqxc.onrender.com/pdf/${lesson.filePath}`;
    link.setAttribute('download', lesson.originalFileName || `${lesson.title.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
>
  <FaFilePdf className="mr-1" />
  Download PDF
</a>
    ) : (
      <a 
        href={lesson.resourceUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`inline-flex items-center px-3 py-1 rounded text-sm ${
          lesson.type === 'video' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
          lesson.type === 'article' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
          lesson.type === 'exercise' ? 'bg-green-50 text-green-700 hover:bg-green-100' :
          'bg-purple-50 text-purple-700 hover:bg-purple-100'
        }`}
      >
        <FaExternalLinkAlt className="mr-1" />
        {lesson.type === 'video' ? 'Watch Video' : 
         lesson.type === 'article' ? 'Read Article' : 
         lesson.type === 'exercise' ? 'Start Exercise' : 
         'View Resource'}
      </a>
    )}
  </div>
)}
      </div>
    </div>
  ))}
</div>
          </div>
        )}

        

        {!module.isMoodle && role === "Teacher" && supplementaryLessons.length > 0 && (
          <div className="supplementary-section mt-8">
            <div className="section-header">
              <h2 className="supplementary-title">
                <FaBook className="mr-2" />
                Supplementary Resources 
              </h2>
            </div>
            
            <div className="supplementary-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplementaryLessons.map(lesson => (
                <div key={lesson._id} className="supplementary-card bg-white rounded-lg shadow-md p-4 relative">
                  <div className="supplementary-content">
                    <div className="flex items-center mb-2">
                      {renderSupplementaryIcon(lesson.type)}
                      <h4 className="font-semibold">{lesson.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="lesson-tag bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {lesson.type}
                      </span>
                      {lesson.duration > 0 && (
                        <span className="lesson-tag duration bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {lesson.duration} min
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{lesson.content || lesson.description || 'No content available'}</p>
                    {lesson.resourceUrl && (
                      <a 
                        href={lesson.resourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FaExternalLinkAlt className="mr-1" />
                        {lesson.type === 'video' ? 'Watch Video' : 
                         lesson.type === 'article' ? 'Read Article' : 
                         'View Resource'}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSupplementary(lesson._id);
                    }}
                    className="delete-button absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetails;
