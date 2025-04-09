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
  const [filteredModules, setFilteredModules] = useState([]); // For filtered results
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // For search input
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/module/');
        setModules(response.data);
        setFilteredModules(response.data); // Initialize filteredModules
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = modules.filter((module) =>
      module.title.toLowerCase().includes(value) ||
      module.description.toLowerCase().includes(value)
    );
    setFilteredModules(filtered);
  };

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await axios.delete(`http://localhost:3000/module/${moduleId}`);
      setModules((prevModules) => prevModules.filter((module) => module._id !== moduleId));
      setFilteredModules((prevModules) => prevModules.filter((module) => module._id !== moduleId));
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
      setModules(response.data);
      setFilteredModules(response.data); // Refresh filteredModules
    } catch (error) {
      console.error("Error fetching updated modules:", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center my-3">
          <h2 className="title">Modules List</h2>
        </div>

        <div className="d-flex justify-content-between align-items-center my-3">
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary add-module-btn" onClick={() => navigate('/addModule')}>
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
                {filteredModules.length === 0 ? (
                  <p>No modules found.</p>
                ) : (
                  filteredModules.map((module) => (
                    <div key={module._id} className="module-card1">
                      {module.image && (
                        <img src={module.image} alt={module.title} className="module-image1" />
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
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleUpdate(module);
                              }}
                            >
                              Update
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(module._id);
                              }}
                            >
                              Delete
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/moduleDetails/${module._id}`);
                              }}
                            >
                              Details
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
    </>
  );
};

export default ListModules;
