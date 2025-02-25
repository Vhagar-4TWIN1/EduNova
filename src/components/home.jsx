import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/main.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/aos/aos.css';
import '../assets/vendor/glightbox/css/glightbox.min.css';
import '../assets/vendor/swiper/swiper-bundle.min.css';
import heroBg from '../assets/img/hero-bg.jpg';
import aboutImg from '../assets/img/about.jpg';



function Home() {
  return (
    <>
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
