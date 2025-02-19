import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css';
import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './assets/vendor/aos/aos.css';
import './assets/vendor/glightbox/css/glightbox.min.css';
import './assets/vendor/swiper/swiper-bundle.min.css';

import heroBg from './assets/img/hero-bg.jpg';
import aboutImg from './assets/img/about.jpg';
import course1 from './assets/img/course-1.jpg';
import course2 from './assets/img/course-2.jpg';
import course3 from './assets/img/course-3.jpg';
import trainer1 from './assets/img/trainers/trainer-1.jpg';
import trainer2 from './assets/img/trainers/trainer-2.jpg';
import trainer3 from './assets/img/trainers/trainer-3.jpg';

function App() {
  const [count, setCount] = useState(0);

  return (
    
      <div className="index-page">
        {/* Header */}
        <header id="header" className="header d-flex align-items-center sticky-top">
          <div className="container-fluid container-xl position-relative d-flex align-items-center">
            <a href="index.html" className="logo d-flex align-items-center me-auto">
              <h1 className="sitename">Mentor</h1>
            </a>
            <nav id="navmenu" className="navmenu">
              <ul>
                <li><a href="index.jsx" className="active">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="courses.html">Courses</a></li>
                <li><a href="trainers.html">Trainers</a></li>
                <li><a href="events.html">Events</a></li>
                <li><a href="pricing.html">Pricing</a></li>
                <li className="dropdown">
                  <a href="#"><span>Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                  <ul>
                    <li><a href="#">Dropdown 1</a></li>
                    <li className="dropdown">
                      <a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                      <ul>
                        <li><a href="#">Deep Dropdown 1</a></li>
                        <li><a href="#">Deep Dropdown 2</a></li>
                      </ul>
                    </li>
                    <li><a href="#">Dropdown 2</a></li>
                  </ul>
                </li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
            <a className="btn-getstarted" href="courses.html">Get Started</a>
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <img src={heroBg} alt="" data-aos="fade-in" />
          <div className="container">
            <h2 data-aos="fade-up" data-aos-delay="100">Learning Today,<br />Leading Tomorrow</h2>
            <p data-aos="fade-up" data-aos-delay="200">We are team of talented designers making websites with Bootstrap</p>
            <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
              <a href="courses.html" className="btn-get-started">Get Started</a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-up" data-aos-delay="100">
                <img src={aboutImg} className="img-fluid" alt="" />
              </div>
              <div className="col-lg-6 order-2 order-lg-1 content" data-aos="fade-up" data-aos-delay="200">
                <h3>Voluptatem dignissimos provident quasi corporis</h3>
                <p className="fst-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></li>
                  <li><i className="bi bi-check-circle"></i> <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
                  <li><i className="bi bi-check-circle"></i> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.</span></li>
                </ul>
                <a href="#" className="read-more"><span>Read More</span><i className="bi bi-arrow-right"></i></a>
              </div>
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
                  <p className="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
                  <p><strong>Email:</strong> <span>info@example.com</span></p>
                </div>
                <div className="social-links d-flex mt-4">
                  <a href=""><i className="bi bi-twitter-x"></i></a>
                  <a href=""><i className="bi bi-facebook"></i></a>
                  <a href=""><i className="bi bi-instagram"></i></a>
                  <a href=""><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About us</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Terms of service</a></li>
                  <li><a href="#">Privacy policy</a></li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><a href="#">Web Design</a></li>
                  <li><a href="#">Web Development</a></li>
                  <li><a href="#">Product Management</a></li>
                  <li><a href="#">Marketing</a></li>
                  <li><a href="#">Graphic Design</a></li>
                </ul>
              </div>
              <div className="col-lg-4 col-md-12 footer-newsletter">
                <h4>Our Newsletter</h4>
                <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                <form action="forms/newsletter.php" method="post" className="php-email-form">
                  <div className="newsletter-form">
                    <input type="email" name="email" placeholder="Enter your email" />
                    <input type="submit" value="Subscribe" />
                  </div>
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                </form>
              </div>
            </div>
          </div>
        </footer>
      </div>
    
  );
}

export default App;
