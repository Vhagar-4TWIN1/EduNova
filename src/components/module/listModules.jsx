import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddModule from "./addModule";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./ListModules.css";

const ListModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:3000/module/");
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await axios.delete(`http://localhost:3000/module/${moduleId}`);
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
      alert("Module deleted successfully!");
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module. Please try again.");
    }
  };

  const handleUpdate = (module) => {
    setSelectedModule(module);
    setIsEditing(true);
  };

  const handleCloseEdit = async () => {
    setIsEditing(false);
    setSelectedModule(null);

    try {
      const response = await axios.get("http://localhost:3000/module/");
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching updated modules:", error);
    }
  };

  return (
    <div className="module-container">
      <div className="header-section">
        <h2 className="page-title">Modules</h2>
{role === "Teacher" && (
  <button className="btn btn-primary" onClick={() => navigate("/addModule")}>
    + Add Module
  </button>
)}
      </div>

      {isEditing ? (
        <AddModule existingModule={selectedModule} onClose={handleCloseEdit} />
      ) : loading ? (
        <p className="loading">Loading modules...</p>
      ) : (
        <div className="module-grid">
          {modules.length === 0 ? (
            <p>No modules found.</p>
          ) : (
            modules.map((module) => (
              <div key={module._id} className="module-card">
                <div className="module-image-wrapper" onClick={() => navigate(`/moduleDetails/${module._id}`)}>
                  {module.image && (
                    <img src={module.image} alt={module.title || "Module"} className="module-image" />
                  )}
                </div>
                <div className="module-details">
                  <h4>{module.title || "Untitled Module"}</h4>
                  <p className="module-description">{module.description || "No description provided."}</p>
                  <div className="meta">
                    {module.category && <span><strong>Category:</strong> {module.category}</span>}
                    {module.difficulty && <span><strong>Difficulty:</strong> {module.difficulty}</span>}
                    {module.createdAt && <span><strong>Created:</strong> {new Date(module.createdAt).toLocaleDateString()}</span>}
                    {module.updatedAt && <span><strong>Updated:</strong> {new Date(module.updatedAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="action-buttons">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUpdate(module)}>Update</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(module._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListModules;
