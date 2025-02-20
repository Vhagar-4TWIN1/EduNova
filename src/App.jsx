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
import Footer from './components/footer';
import Header from './components/header';
import Home from './components/home'; 
import AOS from 'aos';
import 'aos/dist/aos.css';


AOS.init();
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
