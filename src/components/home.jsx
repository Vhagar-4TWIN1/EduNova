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
      

    </>
  
  );
}

export default Home;
