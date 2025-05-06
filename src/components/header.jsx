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

  useEffect(() => {
    let found = window;
    const candidates = ["body", "html", "#root", "main"];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.scrollHeight > el.clientHeight) {
        found = el;
        break;
      }
    }
    setScrollEl(found);
  }, []);

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

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("email", payload.email);
      localStorage.setItem("role", payload.role);
      localStorage.setItem("firstName", payload.firstName);
      localStorage.setItem("lastName", payload.lastName);
      localStorage.setItem("image", payload.photo);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("JWT decode error", err);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen((v) => !v);
  const toggleAITutor = () => setShowAITutor(!showAITutor);
  const toggleGenerateResume = () => setShowGenerateResume(!showGenerateResume);

  const scrolled = scrollPos > 0;
  const inHero = isHome && scrollPos === 0;

  const headerClasses = [
    "header",
    (scrolled || !isHome) && "header-scrolled",
    "d-flex",
    "align-items-center",
    "fixed-top",
  ].filter(Boolean).join(" ");

  const logoClasses = [
    "logo",
    inHero && "logo-fixed-center",
    (scrolled || !isHome) && "logo-scrolled",
  ].filter(Boolean).join(" ");

  return (
    <>
      {showAvatar && <MotivationalAvatar />}

      <header id="header" className={headerClasses}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a href="/home" className={logoClasses} style={{ textDecoration: "none" }}>
            <img src="../assets/logolog.png" alt="EduNova" style={{ height: "1.5em" }} />
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>EduNova</h1>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="/home" className={pathname === "/home" ? "active" : ""}>Home</a></li>
              {localStorage.getItem("role") === "Admin" && <li><a href="/dashboard">Dashboard</a></li>}
              <li><a href="/listModules">Modules</a></li>
              <li><a href="/lesson">Courses</a></li>
              <li className="dropdown">
                <a href="#"><span>Evaluations</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                <ul>
                  <li><a href="/quiz">Level Test</a></li>
                  <li><a href="/quizz">Test</a></li>
                  <li><a href="/Trainers">Trainers</a></li>
                </ul>
              </li>
              <li><a href="/badges">Badges</a></li>
              <li><a href="/ClassicWordGame">Game</a></li>
              <li><a href="/forum">Forum</a></li>
              <li><a href="/music-player">Enjoy music</a></li>
              <li>
                <button className="btn-getstarted" onClick={toggleAITutor}>
                  <i className="bi bi-robot"></i> AI Tutor
                </button>
              </li>
              <li>
                <button className="btn-getstarted" onClick={toggleGenerateResume}>
                  Generate Resume
                </button>
              </li>
              <li><NavbarNotifications /></li>
              <li className="dropdown">
                <button className="btn-getstarted" onClick={toggleDropdown}>
                  {fullName} <i className="bi bi-chevron-down" />
                </button>
                {dropdownOpen && (
                  <ul>
                    <li><a href="/update">Profile</a></li>
                    <li><a href="/calendar">Calendar</a></li>
                    <li><a href="/changePassword">Change Password</a></li>
                    <li><button className="btn-getstarted" onClick={handleLogout}>Logout</button></li>
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
          position: 'fixed', bottom: '20px', right: '20px', width: '400px', maxHeight: '70vh',
          backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            padding: '15px', backgroundColor: '#1976d2', color: 'white',
            borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between'
          }}>
            <h5 style={{ margin: 0 }}>AI Learning Assistant</h5>
            <button onClick={toggleAITutor} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem' }}>×</button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AITutor userId={localStorage.getItem("userId")} />
          </div>
        </div>
      )}

      {showGenerateResume && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '20px', width: '400px', maxHeight: '70vh',
          backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            padding: '15px', backgroundColor: '#1976d2', color: 'white',
            borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between'
          }}>
            <h5 style={{ margin: 0 }}>Generate Resume</h5>
            <button onClick={toggleGenerateResume} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem' }}>×</button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GenerateResume />
          </div>
        </div>
      )}
    </>
  );
}
