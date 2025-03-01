import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/main.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "./assets/vendor/aos/aos.css";
import "./assets/vendor/glightbox/css/glightbox.min.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";

const Starter = () => {
  useEffect(() => {
    import("./assets/vendor/aos/aos.js").then((AOS) => AOS.default.init());
    import("./assets/vendor/glightbox/js/glightbox.min.js");
    import("./assets/vendor/swiper/swiper-bundle.min.js");
  }, []);

  return (
    <>
      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a href="index.html" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Mentor</h1>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="courses.html">Courses</a></li>
              <li><a href="trainers.html">Trainers</a></li>
              <li><a href="events.html">Events</a></li>
              <li><a href="pricing.html">Pricing</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
          <a className="btn-getstarted" href="courses.html">Get Started</a>
        </div>
      </header>

      <main className="main">
        <div className="page-title" data-aos="fade">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1>Starter Page</h1>
                  <p className="mb-0">Use this page as a starter for your own custom pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer id="footer" className="footer position-relative light-background">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <a href="index.html" className="logo d-flex align-items-center">
                <span className="sitename">Mentor</span>
              </a>
              <div className="footer-contact pt-3">
                <p>A108 Adam Street</p>
                <p>New York, NY 535022</p>
                <p><strong>Phone:</strong> +1 5589 55488 55</p>
                <p><strong>Email:</strong> info@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Starter;