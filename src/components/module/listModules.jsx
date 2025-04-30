import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import AddModule from "./addModule";
import "./ListModules.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ListModules = () => {
  const [allModules, setAllModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState("");
  const itemsPerPage = 3;
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleCLick = (module) => {
    if (module.source === "moodle") {

    navigate(`/moduleDetails/moodle/${module._id}`);
    }
    else 
    navigate(`/moduleDetails/course/${module._id}`);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role || "student");

    const fetchModules = async () => {
      try {
        const [localRes, moodleUserRes] = await Promise.all([
          axios.get("http://localhost:3000/module/"),
          fetch(
            `http://localhost/moodle/webservice/rest/server.php?wstoken=7ccfd931c34a195d815957a0759ce508&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=${email}&moodlewsrestformat=json`
          ).then((res) => res.json()),
        ]);

        const localModules = localRes.data.map((mod) => ({
          ...mod,
          source: "local",
        }));

        let moodleModules = [];
        if (moodleUserRes.users && moodleUserRes.users.length > 0) {
          const moodleUserId = moodleUserRes.users[0].id;

          const moodleCoursesRes = await fetch(
            `http://localhost/moodle/webservice/rest/server.php?wstoken=7ccfd931c34a195d815957a0759ce508&wsfunction=core_enrol_get_users_courses&userid=${moodleUserId}&moodlewsrestformat=json`
          );

          const moodleCourses = await moodleCoursesRes.json();
          console.log("Moodle Courses: aaaa", moodleCourses);

          moodleModules = moodleCourses.map((course) => ({
            _id: course.id,
            title: course.fullname,
            description: course.summary || "No description available.",
            image: course.courseimage,
            source: "moodle",
            moodleUrl: `http://localhost/moodle/course/view.php?id=${course.id}`,
          }));
        }

        const combinedModules = [...localModules, ...moodleModules];
        setAllModules(combinedModules);
        setFilteredModules(combinedModules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules or Moodle courses:", error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);

    const filtered = allModules.filter(
      (module) =>
        module.title.toLowerCase().includes(value) ||
        module.description.toLowerCase().includes(value)
    );
    setFilteredModules(filtered);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await axios.delete(`http://localhost:3000/module/${moduleId}`);
      const updatedModules = allModules.filter((mod) => mod._id !== moduleId);
      setAllModules(updatedModules);
      setFilteredModules(updatedModules);
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
      const localModules = response.data.map((mod) => ({
        ...mod,
        source: "local",
      }));
      const updatedModules = [...localModules, ...allModules.filter((m) => m.source === "moodle")];
      setAllModules(updatedModules);
      setFilteredModules(updatedModules);
    } catch (error) {
      console.error("Error fetching updated modules:", error);
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center my-3">
          <h2 className="title">Modules & Moodle Courses</h2>
        </div>

        <div className="d-flex justify-content-between align-items-center my-3">
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {userRole === "teacher" && (
            <button
              className="btn btn-primary add-module-btn"
              onClick={() => navigate("/addModule")}
            >
              + Add Module
            </button>
          )}
        </div>

        {isEditing ? (
          <AddModule existingModule={selectedModule} onClose={handleCloseEdit} />
        ) : loading ? (
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
                        onClick={() => handleCLick(module)}
                      />
                    )}
                    <div className="module-content">
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </div>

                    {module.source === "moodle" ? (
                      <button
                        className="btn btn-info"
                        onClick={() => window.open(module._id, "_blank")}
                      >
                        View on Moodle
                      </button>
                    ) : (
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        ></button>
                        <ul className="dropdown-menu">
                          {userRole === "Teacher" && (
                            <>
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
                            </>
                          )}
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
                    )}
                  </div>
                ))
              )}
            </div>

            {filteredModules.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Module pagination">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <li
                        key={number}
                        className={`page-item ${currentPage === number ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(number)}>
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
      </div>
    </>
  );
};

export default ListModules;
