import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';
import AddModule from './addModule';
import './ListModules.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ListModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate(); // ✅ For navigation

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/module/');
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
      setModules((prevModules) => prevModules.filter((module) => module._id !== moduleId));
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
      const response = await axios.get('http://localhost:3000/module/');
      setModules(response.data); // Refresh module list
    } catch (error) {
      console.error("Error fetching updated modules:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center my-3  ">
          <h2 className="title">Modules List</h2>
          
        </div>
        <div className="d-flex justify-content-between align-items-center my-3 add-module-btn ">
          <button className="btn btn-primary" onClick={() => navigate('/addModule')}>
            + Add Module
          </button>
        </div>
        
        {isEditing ? (
          <AddModule existingModule={selectedModule} onClose={handleCloseEdit} />
        ) : (
          <>
            {loading ? (
              <p>Loading modules...</p>
            ) : (
              <div className="module-list">
                {modules.length === 0 ? (
                  <p>No modules found.</p>
                ) : (
                  modules.map((module) => (
                    <div key={module._id} className="module-card">
                      {module.image && (
                        <img src={module.image} alt={module.title} className="module-image" />
                      )}
                      <div className="module-content">
                        <h3>{module.title}</h3>
                        <p>{module.description}</p>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                        </button>

                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#" onClick={(e) => {
                              e.preventDefault();
                              handleUpdate(module);
                            }}>
                              Update
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#" onClick={(e) => {
                              e.preventDefault();
                              handleDelete(module._id);
                            }}>
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ListModules;
