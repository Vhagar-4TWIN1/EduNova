// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer
    id="footer"
    className="footer bg-light w-100 fixed-bottom"    style={{ zIndex: 1000 }}            /* ensure it sits on top */
  >
    <div className="container-fluid footer-top py-4">
      <div className="row gy-4">
        <div className="col-lg-4 col-md-6 footer-about">
          <a href="index.html" className=" d-flex align-items-center">
          <h1 className="sitename-footer">EduNova</h1>
          </a>
          <div className="footer-contact pt-3">
            <p>ESPRIT</p>
            <p>Little Ariana</p>
            <p className="mt-3">
              <strong>Phone:</strong> <span>+1 5589 55488 55</span>
            </p>
            <p>
              <strong>Email:</strong> <span>info@example.com</span>
            </p>
          </div>
          <div className="social-links d-flex mt-4">
            <a href="#"><i className="bi bi-twitter-x"></i></a>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
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
            <div className="newsletter-form d-flex">
              <input type="email" name="email" placeholder="Enter your email" className="flex-grow-1 me-2" />
              <input type="submit" value="Subscribe" className="btn btn-primary" />
            </div>
            <div className="loading">Loading</div>
            <div className="error-message"></div>
          </form>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
