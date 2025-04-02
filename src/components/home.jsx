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
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token reçu:", token);

      // Decode token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
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

  const features = [
    { icon: "bi-eye", color: "#ffbb2c", title: "Lorem Ipsum" },
    { icon: "bi-infinity", color: "#5578ff", title: "Dolor Sitema" },
    { icon: "bi-mortarboard", color: "#e80368", title: "Sed perspiciatis" },
    { icon: "bi-nut", color: "#e361ff", title: "Magni Dolores" },
    { icon: "bi-shuffle", color: "#47aeff", title: "Nemo Enim" },
    { icon: "bi-star", color: "#ffa76e", title: "Eiusmod Tempor" },
    { icon: "bi-x-diamond", color: "#11dbcf", title: "Midela Teren" },
    { icon: "bi-camera-video", color: "#4233ff", title: "Pira Neve" },
    { icon: "bi-command", color: "#b2904f", title: "Dirada Pack" },
    { icon: "bi-dribbble", color: "#b20969", title: "Moton Ideal" },
    { icon: "bi-activity", color: "#ff5828", title: "Verdo Park" },
    { icon: "bi-brightness-high", color: "#29cc61", title: "Flavor Nivelanda" }
  ];
  
  const courses = [
    {
      img: {course1},
      category: "Web Development",
      price: "$169",
      title: "Website Design",
      description:
        "Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore.",
      trainer: { img: "assets/img/trainers/trainer-1-2.jpg", name: "Antonio" },
      students: 50,
      likes: 65
    },
    {
      img: {course2},
      category: "Marketing",
      price: "$250",
      title: "Search Engine Optimization",
      description:
        "Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore.",
      trainer: { img: "assets/img/trainers/trainer-2-2.jpg", name: "Lana" },
      students: 35,
      likes: 42
    },
    {
      img: {course3},
      category: "Content",
      price: "$180",
      title: "Copywriting",
      description:
        "Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore.",
      trainer: { img: "assets/img/trainers/trainer-3-2.jpg", name: "Brandon" },
      students: 20,
      likes: 85
    }
  ];

  const trainers = [
    {
      name: "Walter White",
      role: "Web Development",
      imgSrc: {trainer1},
      description:
        "Magni qui quod omnis unde et eos fuga et exercitationem. Odio veritatis perspiciatis quaerat qui aut aut aut",
    },
    {
      name: "Sarah Jhinson",
      role: "Marketing",
      imgSrc: {trainer2},
      description:
        "Repellat fugiat adipisci nemo illum nesciunt voluptas repellendus. In architecto rerum rerum temporibus",
    },
    {
      name: "William Anderson",
      role: "Content",
      imgSrc: {trainer3},
      description:
        "Voluptas necessitatibus occaecati quia. Earum totam consequuntur qui porro et laborum toro des clara",
    },
  ];

  return (
    <>
      <section id="hero" className="hero section dark-background">
        <img src={heroBg} alt="Hero Background" data-aos="fade-in" />
        <div className="container">
          <h2 data-aos="fade-up" data-aos-delay="100">Learning Today,<br />Leading Tomorrow</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            We are a team of talented designers making websites with Bootstrap
          </p>
          <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
            <a href="courses.html" className="btn-get-started">Get Started</a>
          </div>
        </div>
      </section>

      <section id="about" className="about section">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-up" data-aos-delay="100">
              <img src={aboutImg} className="img-fluid" alt="About Us" />
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

      <section id="counts" className="section counts light-background">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="1232" data-purecounter-duration="1" className="purecounter"></span>
                <p>Students</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="64" data-purecounter-duration="1" className="purecounter"></span>
                <p>Courses</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="42" data-purecounter-duration="1" className="purecounter"></span>
                <p>Events</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item text-center w-100 h-100">
                <span data-purecounter-start="0" data-purecounter-end="24" data-purecounter-duration="1" className="purecounter"></span>
                <p>Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="why-us" className="section why-us">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div className="why-box">
              <h3>Why Choose Our Products?</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit
                Asperiores dolores sed et. Tenetur quia eos. Autem tempore quibusdam vel necessitatibus optio ad corporis.
              </p>
              <div className="text-center">
                <a href="#" className="more-btn">
                  <span>Learn More</span> <i className="bi bi-chevron-right"></i>
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
                  <p>Consequuntur sunt aut quasi enim aliquam quae harum pariatur laboris nisi ut aliquip</p>
                </div>
              </div>

              <div className="col-xl-4" data-aos="fade-up" data-aos-delay="300">
                <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                  <i className="bi bi-gem"></i>
                  <h4>Ullamco laboris ladore pan</h4>
                  <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt</p>
                </div>
              </div>

              <div className="col-xl-4" data-aos="fade-up" data-aos-delay="400">
                <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                  <i className="bi bi-inboxes"></i>
                  <h4>Labore consequatur incidid dolore</h4>
                  <p>Aut suscipit aut cum nemo deleniti aut omnis. Doloribus ut maiores omnis facere</p>
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
            {features.map((feature, index) => (
              <div className="col-lg-3 col-md-4" data-aos="fade-up" data-aos-delay={(index + 1) * 100} key={index}>
                <div className="features-item">
                  <i className={`bi ${feature.icon}`} style={{ color: feature.color }}></i>
                  <h3><a href="#" className="stretched-link">{feature.title}</a></h3>
                </div>
              </div>
            ))}
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
            {courses.map((course, index) => (
              <div className="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay={(index + 1) * 100} key={index}>
                <div className="course-item">
                  <img src={course.img} className="img-fluid" alt="..." />
                  <div className="course-content">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="category">{course.category}</p>
                      <p className="price">{course.price}</p>
                    </div>
                    <h3><a href="#">{course.title}</a></h3>
                    <p className="description">{course.description}</p>
                    <div className="trainer d-flex justify-content-between align-items-center">
                      <div className="trainer-profile d-flex align-items-center">
                        <img src={course.trainer.img} className="img-fluid" alt="" />
                        <a href="#" className="trainer-link">{course.trainer.name}</a>
                      </div>
                      <div className="trainer-rank d-flex align-items-center">
                        <i className="bi bi-person user-icon"></i>&nbsp;{course.students}
                        &nbsp;&nbsp;
                        <i className="bi bi-heart heart-icon"></i>&nbsp;{course.likes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="trainers-index" className="section trainers-index">
      <div className="container">
        <div className="row">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 d-flex"
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <div className="member">
                <img src={trainer.imgSrc} className="img-fluid" alt={trainer.name} />
                <div className="member-content">
                  <h4>{trainer.name}</h4>
                  <span>{trainer.role}</span>
                  <p>{trainer.description}</p>
                  <div className="social">
                    <a href="#"><i className="bi bi-twitter-x"></i></a>
                    <a href="#"><i className="bi bi-facebook"></i></a>
                    <a href="#"><i className="bi bi-instagram"></i></a>
                    <a href="#"><i className="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

export default Home;