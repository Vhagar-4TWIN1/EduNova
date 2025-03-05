import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/aos/aos.css";
import "../assets/vendor/glightbox/css/glightbox.min.css";
import "../assets/vendor/swiper/swiper-bundle.min.css";

function Header() {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="index.html" className="logo d-flex align-items-center me-auto">
          <h1 className="sitename">EduNova</h1>
        </a>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="index.jsx" className="active">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Courses</a></li>
            <li><a href="/listModules">Modules</a></li>
            <li><a href="">Evaluations</a></li>
            <li><a href="">Budges</a></li>
            <li><a href="">Profile</a></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
        <a className="btn-getstarted" href="courses.html">
          Log out
        </a>
      </div>
    </header>
  );
}

export default Header;
