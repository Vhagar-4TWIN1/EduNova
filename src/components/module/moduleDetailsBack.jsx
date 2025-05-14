import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ModuleDetails.css'; // Add a CSS file for styling

const ModuleDetailsBack = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(`https://edunova-back-rqxc.onrender.com/module/${id}`,
           {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
        );
        console.log("Module Details:", response.data); // Debugging
        setModule(response.data);
      } catch (error) {
        console.error("Error fetching module details:", error);
      }
    };

    fetchModuleDetails();
  }, [id]);

  if (!module) {
    return <p className="loading-text">Loading module details...</p>;
  }

  return (
    <div className="module-details-container">
      <div className="module-card">
        {module.image && (
          <img src={module.image} alt={module.title} className="module-image" />
        )}
        <div className="module-content">
          <h1 className="module-title">{module.title}</h1>
          <p className="module-description">{module.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailsBack;