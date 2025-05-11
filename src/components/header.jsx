// File: src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarNotifications from "../components/Notifications.jsx";
import AITutor from "./AITutor";
import GenerateResume from "./GenerateResume";
import MotivationalAvatar from "./MotivationalAvatar";

import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/aos/aos.css";
import "../assets/vendor/glightbox/css/glightbox.min.css";
import "../assets/vendor/swiper/swiper-bundle.min.css";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/home";

  const [scrollEl, setScrollEl] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showGenerateResume, setShowGenerateResume] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);

  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Guest";

  // find the scrolling container
  useEffect(() => {
    let found = window;
    ["body", "html", "#root", "main"].some(sel => {
      const el = document.querySelector(sel);
      if (el && el.scrollHeight > el.clientHeight) {
        found = el;
        return true;
      }
      return false;
    });
    setScrollEl(found);
  }, []);

  // track scroll position
  useEffect(() => {
    if (!scrollEl) return;
    const handleScroll = () => {
      const top = scrollEl === window ? window.scrollY : scrollEl.scrollTop;
      setScrollPos(top);
    };
    scrollEl.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [scrollEl]);

  // handle token login
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      [
        ["token", token],
        ["userId", payload.userId],
        ["email", payload.email],
        ["role", payload.role],
        ["firstName", payload.firstName],
        ["lastName", payload.lastName],
        ["image", payload.photo]
      ].forEach(([key, val]) => localStorage.setItem(key, val));
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("JWT decode error", err);
    }
  }, [navigate]);

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Aucun token trouvé dans localStorage");

    const response = await fetch('http://localhost:3000/api/auth/signout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la déconnexion");
    }

    localStorage.clear();
    window.location.href = '/';
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error.message);
    alert("Erreur lors de la déconnexion : " + error.message);
  }
};

  const toggleDropdown = () => setDropdownOpen(v => !v);
  const toggleAITutor = () => setShowAITutor(v => !v);
  const toggleGenerateResume = () => setShowGenerateResume(v => !v);

  const scrolled = scrollPos > 0;
  const inHero = isHome && scrollPos === 0;

  const headerClasses = [
    "header",
    (scrolled || !isHome) && "header-scrolled",
    "d-flex",
    "align-items-center",
    "fixed-top",
  ]
    .filter(Boolean)
    .join(" ");

  const logoClasses = [
    "logo",
    inHero && "logo-fixed-center",
    (scrolled || !isHome) && "logo-scrolled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {showAvatar && <MotivationalAvatar />}

      <header id="header" className={headerClasses}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          {/* Logo */}
          <a href="/home" className={logoClasses} style={{ textDecoration: "none" }}>
            <img src="../assets/logolog.png" alt="EduNova" style={{ height: "1.5em" ,  }} />
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>EduNova</h1>
          </a>

          {/* Navigation */}
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="/home" className={pathname === "/home" ? "active" : ""}>
                  Home
                </a>
              </li>
             
              <li>
                <a href="/listModules">Modules</a>
              </li>

              <li>
                <a href="/quiz">Evaluation</a>
              </li>
            
              <li className="dropdown">
                <a href="#">
                  <span>Game</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown" />
                </a>
                <ul>
                  <li>
                    <a href="/ClassicWordGame">Words Game</a>
                  </li>
                  <li>
                    <a href="/quizz">Quiz Game</a>
                  </li>
                  
                </ul>
              </li>
              <li>
                    <a href="/Trainers">Trainers</a>
                  </li>
              <li>
                <a href="/badges">Badges</a>
              </li>
              
              <li>
                <a href="/forum">Forum</a>
              </li>
              <li>
                <a href="/music-player">Enjoy music</a>
              </li>
              <li>
                <NavbarNotifications />
              </li>
              {/* User Dropdown */}
              <li className="dropdown">
                <button className="btn-getstarted" onClick={toggleDropdown}>
                  {fullName} <i className="bi bi-chevron-down" />
                </button>
                {dropdownOpen && (
                  <ul>
                    <li>
                      <a href="/update">Profile</a>
                    </li>
                    <li className="dropdown-item">
                <a href="/lesson">Courses</a>
              </li>
                    <li>
                      <a href="/calendar">Calendar</a>
                    </li>
                    <li>
                      <a href="/changePassword">Change Password</a>
                    </li>
                    <li>
                      <a href="/videochat">Video Call</a>
                    </li>
                    <li>
                      <a href="/exam">pass your exam</a>
                    </li>
                    {localStorage.getItem("role") === "Admin" && (
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
              )}
                    <li>
                      <button className="dropdown-item" onClick={toggleAITutor}>
                        <i className="bi bi-robot" /> AI Tutor
                      </button>
                    </li>
                  
                    <li>
                      <button className="dropdown-item" onClick={toggleGenerateResume}>
                        <i className="bi bi-file-earmark-person" /> Generate Resume
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
          </nav>
        </div>
      </header>

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
