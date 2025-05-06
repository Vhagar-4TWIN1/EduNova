import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarNotifications from "../components/Notifications.jsx";

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

  const [scrollPos, setScrollPos] = useState(0);
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

  const scrolled = scrollPos > 0;             
  const inHero   = isHome && scrollPos === 0; 

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("firstName", payload.firstName);
      localStorage.setItem("lastName", payload.lastName);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("JWT decode error", err);
    }
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(v => !v);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const firstName = localStorage.getItem("firstName");
  const lastName  = localStorage.getItem("lastName");
  const fullName  = firstName && lastName ? `${firstName} ${lastName}` : "Guest";

  const headerClasses = [
    "header",
    (scrolled || !isHome)  && "header-scrolled",
    "d-flex",
    "align-items-center",
    "fixed-top",
  ].filter(Boolean).join(" ");

  const logoClasses = [
    "logo",
    inHero   && "logo-fixed-center",
    (scrolled || !isHome) && "logo-scrolled",
  ].filter(Boolean).join(" ");

  return (
    <header id="header" className={headerClasses}>
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
      <a href="/home" className={logoClasses} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
  <img 
    src="../assets/logolog.png" 
    alt="EduNova" 
    style={{
      height: "1.5em", // scale with text size
      verticalAlign: "middle",
    }} 
  />
  <h1 style={{ margin: 0, fontSize: "1.5rem" }}>EduNova</h1>
</a>


        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <a href="/home" className={pathname === "/home" ? "active" : ""}>
                Home
              </a>
            </li>
            {localStorage.getItem("role") === "Admin" && (
              <li><a href="/dashboard">Dashboard</a></li>
            )}
            <li><a href="/listModules">Modules</a></li>
            <li><a href="/lesson">Courses</a></li>
            <li><a href="">Evaluations</a></li>
            <li><a href="/badges">Badges</a></li>
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
                  <li>
                    <button className="btn-getstarted" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
      </div>
    </header>
  );
}
