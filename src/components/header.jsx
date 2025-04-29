import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/aos/aos.css";
import "../assets/vendor/glightbox/css/glightbox.min.css";
import "../assets/vendor/swiper/swiper-bundle.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AITutor from "./AITutor"; // Import the AI Tutor component
import GenerateResume from "./GenerateResume"; // Import the GenerateResume component
import MotivationalAvatar from "./MotivationalAvatar"; 


function Header() {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false); // State for AI Tutor visibility
  const [showGenerateResume, setShowGenerateResume] = useState(false); // State for Generate Resume visibility
  const [showAvatar, setShowAvatar] = useState(true);



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token reçu:", token);
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

        navigate("/home", { replace: true });
      } catch (e) {
        console.error("Erreur de décodage JWT", e);
      }
    }
  }, []);

  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleAITutor = () => {
    setShowAITutor(!showAITutor);
  };

  const toggleGenerateResume = () => {
    setShowGenerateResume(!showGenerateResume); // Toggle visibility of GenerateResume component
  };

  return (
    <>
    {showAvatar && <MotivationalAvatar />}
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
              <li>
                <a href="">About</a>
              </li>
              <li>
                <a href="/listModules">Modules</a>
              </li>
              <li>
                <a href="">Evaluations</a>
              </li>
              <li>
                <a href="/badges">Budges</a>
              </li>
              <li>
                <a href="/music-player">Enjoy music</a>
              </li>
              <li>
                <button 
                  className="btn-getstarted"
                  onClick={toggleAITutor}
                  style={{ marginRight: '10px' }}
                >
                  <i className="bi bi-robot"></i> AI Tutor
                </button>
              </li>
              

              <li>
                <button
                  className="btn-getstarted"
                  onClick={toggleGenerateResume} // Add this line to toggle GenerateResume component
                >
                  Generate Resume
                </button>
              </li>

              <li className="dropdown">
                <button className="btn-getstarted" onClick={toggleDropdown}>
                  {firstName && lastName
                    ? `${firstName} ${lastName}`
                    : "Guest"}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </button>
                {isDropdownVisible && (
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

      

      {/* AI Tutor Modal */}
      {showAITutor && (
        <div className="ai-tutor-modal" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          maxHeight: '70vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="ai-tutor-header" style={{
            padding: '15px',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h5 style={{ margin: 0 }}>AI Learning Assistant</h5>
            <button 
              onClick={toggleAITutor}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AITutor userId={localStorage.getItem("userId")} />
          </div>
        </div>
      )}

      {/* Generate Resume Component */}
      {showGenerateResume && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '400px',
          maxHeight: '70vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="generate-resume-header" style={{
            padding: '15px',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h5 style={{ margin: 0 }}>Generate Resume</h5>
            <button 
              onClick={toggleGenerateResume}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GenerateResume />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
