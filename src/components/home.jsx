import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/main.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/aos/aos.css';
import '../assets/vendor/glightbox/css/glightbox.min.css';
import '../assets/vendor/swiper/swiper-bundle.min.css';

import heroBg from '../assets/img/hero-bg.jpg';
import aboutImg from '../assets/img/about.jpg';
import course1 from '../assets/img/course-1.jpg';
import course2 from '../assets/img/course-2.jpg';
import course3 from '../assets/img/course-3.jpg';
import trainer1 from '../assets/img/trainers/trainer-1.jpg';
import trainer2 from '../assets/img/trainers/trainer-2.jpg';
import trainer3 from '../assets/img/trainers/trainer-3.jpg';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("token", token);
        localStorage.setItem("userId", payload.userId);
        localStorage.setItem("email", payload.email);
        localStorage.setItem("role", payload.role);
        localStorage.setItem("firstName", payload.firstName);
        localStorage.setItem("lastName", payload.lastName);
        localStorage.setItem("image", payload.photo);
        navigate("/home", { replace: true });
      } catch (e) {
        console.error("JWT decode error:", e);
      }
    }
  }, []);

  const features = [
    { icon: "bi-eye", color: "#ffbb2c", title: "Clear Vision" },
    { icon: "bi-infinity", color: "#5578ff", title: "Unlimited Learning" },
    { icon: "bi-mortarboard", color: "#e80368", title: "Certified Trainers" },
    { icon: "bi-nut", color: "#e361ff", title: "Robust Tools" },
    { icon: "bi-shuffle", color: "#47aeff", title: "Flexible Options" },
    { icon: "bi-star", color: "#ffa76e", title: "Top Rated Courses" }
  ];

  const courses = [
    {
      img: course1,
      category: "Web Development",
      price: "$169",
      title: "Website Design",
      description: "Build modern, responsive websites with confidence.",
      trainer: { img: trainer1, name: "Antonio" },
      students: 50,
      likes: 65
    },
    {
      img: course2,
      category: "Marketing",
      price: "$250",
      title: "SEO Mastery",
      description: "Rank higher on search engines and drive traffic.",
      trainer: { img: trainer2, name: "Lana" },
      students: 35,
      likes: 42
    },
    {
      img: course3,
      category: "Content",
      price: "$180",
      title: "Copywriting",
      description: "Write compelling content that converts.",
      trainer: { img: trainer3, name: "Brandon" },
      students: 20,
      likes: 85
    }
  ];

  const trainers = [
    {
      name: "Walter White",
      role: "Web Development",
      img: trainer1,
      description: "Expert in frontend frameworks and responsive design."
    },
    {
      name: "Sarah Jhinson",
      role: "Marketing",
      img: trainer2,
      description: "Specialist in brand strategy and digital campaigns."
    },
    {
      name: "William Anderson",
      role: "Content",
      img: trainer3,
      description: "Master of storytelling and persuasive writing."
    }
  ];

  return (
    <main>

      {/* Hero Section */}
      <section id="hero" className="hero section text-white text-center d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', height: '100vh', backgroundPosition: 'center', position: 'relative' }}>
        <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.6)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
        <div className="container position-relative z-index-10">
          <h1 className="display-4 fw-bold" data-aos="fade-up">Learning Today,<br />Leading Tomorrow</h1>
          <p className="lead mt-3" data-aos="fade-up" data-aos-delay="200">Empowering growth through skill and mentorship.</p>
          <a href="#courses" className="btn btn-warning mt-4 px-4 py-2 shadow" data-aos="fade-up" data-aos-delay="300">Explore Courses</a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section py-5 bg-white">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <img src={aboutImg} className="img-fluid rounded shadow" alt="About" />
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <h3 className="fw-bold mb-3">Why Learn With Us?</h3>
              <p className="text-muted">We provide quality training with industry experts and modern tools.</p>
              <ul className="list-unstyled mt-3">
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> Real-world project experience</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> Personalized mentorship</li>
                <li><i className="bi bi-check-circle-fill text-success me-2"></i> Career support and networking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section bg-light py-5">
        <div className="container">
          <div className="row gy-4 text-center">
            {features.map((feat, index) => (
              <div className="col-lg-4 col-md-6" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="p-4 shadow-sm rounded bg-white h-100 hover-shadow transition">
                  <i className={`bi ${feat.icon}`} style={{ fontSize: '2rem', color: feat.color }}></i>
                  <h5 className="mt-3">{feat.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="section py-5">
        <div className="container">
          <h3 className="text-center mb-5 fw-bold">Popular Courses</h3>
          <div className="row gy-4">
            {courses.map((course, index) => (
              <div className="col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card h-100 shadow-sm border-0">
                  <img src={course.img} className="card-img-top" alt={course.title} />
                  <div className="card-body">
                    <span className="badge bg-secondary">{course.category}</span>
                    <h5 className="mt-3 fw-semibold">{course.title}</h5>
                    <p className="text-muted small">{course.description}</p>
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-between small text-muted">
                    <span><i className="bi bi-person"></i> {course.trainer.name}</span>
                    <span><i className="bi bi-heart-fill text-danger"></i> {course.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section id="trainers" className="section bg-light py-5">
        <div className="container">
          <h3 className="text-center mb-5 fw-bold">Meet Our Trainers</h3>
          <div className="row gy-4">
            {trainers.map((trainer, index) => (
              <div className="col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card h-100 text-center shadow-sm border-0">
                  <img src={trainer.img} className="card-img-top" alt={trainer.name} />
                  <div className="card-body">
                    <h5 className="fw-semibold">{trainer.name}</h5>
                    <p className="text-muted mb-2">{trainer.role}</p>
                    <p className="small">{trainer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
