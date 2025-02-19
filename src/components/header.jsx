import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/main.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/aos/aos.css';
import '../assets/vendor/glightbox/css/glightbox.min.css';
import '../assets/vendor/swiper/swiper-bundle.min.css';

function Header() {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="index.html" className="logo d-flex align-items-center me-auto">
          <h1 className="sitename">Mentor</h1>
        </a>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="index.jsx" className="active">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Courses</a></li>
            <li><a href="">Trainers</a></li>
            <li><a href="">Events</a></li>
            <li><a href="">Pricing</a></li>
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
            <li><a href="">Contact</a></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
        <a className="btn-getstarted" href="courses.html">Get Started</a>
      </div>
    </header>
  );
}

export default Header;
