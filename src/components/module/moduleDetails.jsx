import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ModuleDetails.css';

const ModuleDetailsBack = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/module/${id}`);
        setModule(response.data);
      } catch (error) {
        console.error("Error fetching module details:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/lessons/module/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
    fetchModuleDetails();
  }, [id]);

  if (!module) return <p className="loading-text">Loading module details...</p>;

  return (
    <div className="module-details-container">
      <div className="module-card">
        {module.image && (
          <img src={module.image} alt={module.title} className="module-image" />
        )}
        <div className="module-content">
          <h1 className="module-title">{module.title}</h1>
          <p className="module-description">{module.description}</p>

          <div className="module-lessons">
            <h2>Lessons</h2>
            {lessons.length === 0 ? (
              <p>No lessons found for this module.</p>
            ) : (
              <div className="lesson-list">
             {lessons.map((lesson) => (
  <div className="lesson-item" key={lesson._id}>
    <div className="lesson-header">
      <div>
        <h3>{lesson.title}</h3>
        <p className="lesson-type">{lesson.typeLesson}</p>
      </div>
      <a
  href={lesson.fileUrl}
  className="download-icon"
  download
  target="_blank"
  rel="noopener noreferrer"
  title="Download file"
>
  <FaDownload />
</a>
          </div>
          <p>{lesson.content}</p>
        </div>
      ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailsBack;
