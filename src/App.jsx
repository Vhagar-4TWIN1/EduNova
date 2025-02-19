import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main.css';
import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
import './assets/vendor/aos/aos.css';
import './assets/vendor/glightbox/css/glightbox.min.css';
import './assets/vendor/swiper/swiper-bundle.min.css';

import Header from './components/header';
import Home from './components/home'; 
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './components/footer';

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
