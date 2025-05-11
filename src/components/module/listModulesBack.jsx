import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import AddModule from "./addModule";
import "./ListModules.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ListModulesBack = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:3000/module/",
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setModules(response.data);
        setFilteredModules(response.data);
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
    setCurrentPage(1); // Reset to first page when searching

    const filtered = modules.filter(
      (module) =>
        module.title.toLowerCase().includes(value) ||
        module.description.toLowerCase().includes(value)
    );
    setFilteredModules(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await axios.delete(`http://localhost:3000/module/${moduleId}`);
      setModules((prevModules) =>
        prevModules.filter((module) => module._id !== moduleId)
      );
      setFilteredModules((prevModules) =>
        prevModules.filter((module) => module._id !== moduleId)
      );
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
    setCurrentPage(1); // Reset to first page after update

    try {
      const response = await axios.get("http://localhost:3000/module/");
      setModules(response.data);
      setFilteredModules(response.data);
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
        </div>

        {isEditing ? (
          <AddModule
            existingModule={selectedModule}
            onClose={handleCloseEdit}
          />
        ) : (
          <>
            {loading ? (
              <p>Loading modules...</p>
            ) : (
              <>
                <div className="module-list">
                  {currentItems.length === 0 ? (
                    <p>No modules found.</p>
                  ) : (
                    currentItems.map((module) => (
                      <div key={module._id} className="module-card1">
                        {module.image && (
                          <img
                            src={module.image}
                            alt={module.title}
                            className="module-image1"
                          />
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
                          ></button>

                          <ul className="dropdown-menu">
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(
                                    `/dashboard/moduleDetailsBack/${module._id}`
                                  );
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

                {/* Pagination controls */}
                {filteredModules.length > itemsPerPage && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Module pagination">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((number) => (
                          <li
                            key={number}
                            className={`page-item ${
                              currentPage === number ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(number)}
                            >
                              {number}
                            </button>
                          </li>
                        ))}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ListModulesBack;
