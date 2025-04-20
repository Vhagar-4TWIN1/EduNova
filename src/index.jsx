import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/main.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "./assets/vendor/aos/aos.css";
import "./assets/vendor/glightbox/css/glightbox.min.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";

import heroBg from "./assets/img/hero-bg.jpg";
import aboutImg from "./assets/img/about.jpg";
import course1 from "./assets/img/course-1.jpg";
import trainer1 from "./assets/img/trainers/trainer-1.jpg";

const Index = () => {
  return (
    <div className="index-page">
      {/* Header */}
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <a
            href="index.html"
            className="logo d-flex align-items-center me-auto"
          >
            <h1 className="sitename">Mentor</h1>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="index.html" className="active">
                  Home
                  <br />
                </a>
              </li>
              <li>
                <a href="about.html">About</a>
              </li>
              <li>
                <a href="courses.html">Courses</a>
              </li>
              <li>
                <a href="trainers.html">Trainers</a>
              </li>
              <li>
                <a href="events.html">Events</a>
              </li>
              <li>
                <a href="pricing.html">Pricing</a>
              </li>
              <li className="dropdown">
                <a href="#">
                  <span>Dropdown</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="#">Dropdown 1</a>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      <span>Deep Dropdown</span>{" "}
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="#">Deep Dropdown 1</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 2</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 3</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 4</a>
                      </li>
                      <li>
                        <a href="#">Deep Dropdown 5</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">Dropdown 2</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 3</a>
                  </li>
                  <li>
                    <a href="#">Dropdown 4</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="contact.html">Contact</a>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
          <a className="btn-getstarted" href="courses.html">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero section dark-background">
        <img src={heroBg} alt="" data-aos="fade-in" />
        <div className="container">
          <h2 data-aos="fade-up" data-aos-delay="100">
            Learning Today,
            <br />
            Leading Tomorrow
          </h2>
          <p data-aos="fade-up" data-aos-delay="200">
            We are team of talented designers making websites with Bootstrap
          </p>
          <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
            <a href="courses.html" className="btn-get-started">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="container">
          <div className="row gy-4">
            <div
              className="col-lg-6 order-1 order-lg-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img src={aboutImg} className="img-fluid" alt="" />
            </div>
            <div
              className="col-lg-6 order-2 order-lg-1 content"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3>Voluptatem dignissimos provident quasi corporis</h3>
              <p className="fst-italic">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <ul>
                <li>
                  <i className="bi bi-check-circle"></i>{" "}
                  <span>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </span>
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>{" "}
                  <span>
                    Duis aute irure dolor in reprehenderit in voluptate velit.
                  </span>
                </li>
                <li>
                  <i className="bi bi-check-circle"></i>{" "}
                  <span>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate trideta
                    storacalaperda mastiro dolore eu fugiat nulla pariatur.
                  </span>
                </li>
              </ul>
              <a href="#" className="read-more">
                <span>Read More</span>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Counts Section */}
      <section id="counts" className="section counts light-background">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="1232"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Students</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="64"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Courses</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="42"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Events</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="24"
                  data-purecounter-duration="1"
                  className="purecounter"
                ></span>
                <p>Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="section why-us">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="why-box">
                <h3>Why Choose Our Products?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Duis aute irure dolor in reprehenderit Asperiores dolores sed
                  et. Tenetur quia eos. Autem tempore quibusdam vel
                  necessitatibus optio ad corporis.
                </p>
                <div className="text-center">
                  <a href="#" className="more-btn">
                    <span>Learn More</span>{" "}
                    <i className="bi bi-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="row gy-4" data-aos="fade-up" data-aos-delay="200">
                <div className="col-xl-4">
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <i className="bi bi-clipboard-data"></i>
                    <h4>Corporis voluptates officia eiusmod</h4>
                    <p>
                      Consequuntur sunt aut quasi enim aliquam quae harum
                      pariatur laboris nisi ut aliquip
                    </p>
                  </div>
                </div>
                <div
                  className="col-xl-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <i className="bi bi-gem"></i>
                    <h4>Ullamco laboris ladore pan</h4>
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt
                    </p>
                  </div>
                </div>
                <div
                  className="col-xl-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <i className="bi bi-inboxes"></i>
                    <h4>Labore consequatur incidid dolore</h4>
                    <p>
                      Aut suscipit aut cum nemo deleniti aut omnis. Doloribus ut
                      maiores omnis facere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features section">
        <div className="container">
          <div className="row gy-4">
            <div
              className="col-lg-3 col-md-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="features-item">
                <i className="bi bi-eye" style={{ color: "#ffbb2c" }}></i>
                <h3>
                  <a href="" className="stretched-link">
                    Lorem Ipsum
                  </a>
                </h3>
              </div>
            </div>
            {/* Repeat for other feature items */}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Courses</h2>
          <p>Popular Courses</p>
        </div>
        <div className="container">
          <div className="row">
            <div
              className="col-lg-4 col-md-6 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="course-item">
                <img src={course1} className="img-fluid" alt="..." />
                <div className="course-content">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="category">Web Development</p>
                    <p className="price">$169</p>
                  </div>
                  <h3>
                    <a href="course-details.html">Website Design</a>
                  </h3>
                  <p className="description">
                    Et architecto provident deleniti facere repellat nobis iste.
                    Id facere quia quae dolores dolorem tempore.
                  </p>
                  <div className="trainer d-flex justify-content-between align-items-center">
                    <div className="trainer-profile d-flex align-items-center">
                      <img src={trainer1} className="img-fluid" alt="" />
                      <a href="" className="trainer-link">
                        Antonio
                      </a>
                    </div>
                    <div className="trainer-rank d-flex align-items-center">
                      <i className="bi bi-person user-icon"></i>&nbsp;50
                      &nbsp;&nbsp;
                      <i className="bi bi-heart heart-icon"></i>&nbsp;65
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Repeat for other course items */}
          </div>
        </div>
      </section>

      {/* Trainers Index Section */}
      <section id="trainers-index" className="section trainers-index">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-4 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="member">
                <img src={trainer1} className="img-fluid" alt="" />
                <div className="member-content">
                  <h4>Walter White</h4>
                  <span>Web Development</span>
                  <p>
                    Magni qui quod omnis unde et eos fuga et exercitationem.
                    Odio veritatis perspiciatis quaerat qui aut aut aut
                  </p>
                  <div className="social">
                    <a href="">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Repeat for other trainer items */}
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <p className="mt-3">
                  <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                </p>
                <p>
                  <strong>Email:</strong> <span>info@example.com</span>
                </p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About us</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Terms of service</a>
                </li>
                <li>
                  <a href="#">Privacy policy</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <a href="#">Web Design</a>
                </li>
                <li>
                  <a href="#">Web Development</a>
                </li>
                <li>
                  <a href="#">Product Management</a>
                </li>
                <li>
                  <a href="#">Marketing</a>
                </li>
                <li>
                  <a href="#">Graphic Design</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-12 footer-newsletter">
              <h4>Our Newsletter</h4>
              <p>
                Subscribe to our newsletter and receive the latest news about
                our products and services!
              </p>
              <form
                action="forms/newsletter.php"
                method="post"
                className="php-email-form"
              >
                <div className="newsletter-form">
                  <input type="email" name="email" />
                  <input type="submit" value="Subscribe" />
                </div>
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">
                  Your subscription request has been sent. Thank you!
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="container copyright text-center mt-4">
          <p>
            © <span>Copyright</span>{" "}
            <strong className="px-1 sitename">Mentor</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
          <div className="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>{" "}
            Distributed by <a href="https://themewagon.com">ThemeWagon</a>
          </div>
        </div>
      </footer>

      {/* Scroll Top */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>

      {/* Preloader */}
      <div id="preloader"></div>
    </div>
  );
};

export default Index;
