import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/aos/aos.css";
import "../assets/vendor/glightbox/css/glightbox.min.css";
import "../assets/vendor/swiper/swiper-bundle.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Header() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token reçu:", token);

      // Decode token
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Payload décodé:", payload);

        localStorage.setItem("token", token);
        localStorage.setItem("userId", payload.userId);
        localStorage.setItem("email", payload.email);
        localStorage.setItem("role", payload.role);
        localStorage.setItem("firstName", payload.firstName);
        localStorage.setItem("lastName", payload.lastName);
        localStorage.setItem("image", payload.photo);

        navigate("/home", { replace: true }); // enlève le ?token=... de l'URL
      } catch (e) {
        console.error("Erreur de décodage JWT", e);
      }
    }
  }, []);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Contrôle l'affichage du menu déroulant

  // Récupérer les informations de l'utilisateur depuis localStorage
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const handleLogout = () => {
    localStorage.clear();

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
            <li>
              <a href="/home" className="active">
                Home
              </a>
            </li>
            
            {localStorage.getItem("role") === "Admin" && (
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
            )}

            <li>
              <a href="/listModules">Modules</a>
            </li>
            <li>
              <a href="">Evaluations</a>
            </li>
            <li>
              <a href="/badges">Budges</a>
            </li>
            <li className="dropdown">
              <button className="btn-getstarted" onClick={toggleDropdown}>
                {firstName && lastName
                  ? `${firstName} ${lastName}` // Affichage du prénom et nom dans le bouton
                  : "Guest"}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </button>
              {isDropdownVisible && ( // Si le dropdown est visible, afficher les options
                <ul>
                  <li>
                    <a href="/update">Profile</a>
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
