import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/aos/aos.css";
import "../assets/vendor/glightbox/css/glightbox.min.css";
import "../assets/vendor/swiper/swiper-bundle.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Contrôle l'affichage du menu déroulant
  
  // Récupérer les informations de l'utilisateur depuis localStorage
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const handleLogout = () => {
    // Supprimer les informations de l'utilisateur du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");

    navigate("/"); // Rediriger après la déconnexion
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible); // Alterne la visibilité du dropdown
  };

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="index.html" className="logo d-flex align-items-center me-auto">
          <h1 className="sitename">EduNova</h1>
        </a>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="index.jsx" className="active">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Courses</a></li>
            <li><a href="/listModules">Modules</a></li>
            <li><a href="">Evaluations</a></li>
            <li><a href="">Budges</a></li>
            <li className="dropdown">
              <button className="btn-getstarted" onClick={toggleDropdown}>
                {firstName && lastName ? (
                  `${firstName} ${lastName}` // Affichage du prénom et nom dans le bouton
                ) : (
                  "Guest"
                )}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </button>
              {isDropdownVisible && ( // Si le dropdown est visible, afficher les options
                <ul>
                  <li>
                    <a href="#">Profile</a>
                  </li>
                  <li>
                    <button className="btn-getstarted" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;
