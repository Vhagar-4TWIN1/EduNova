import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
const HERO_SLIDES = [
  { 
    id: 1, 
    bg: '/assets/hero-3.jpg', 
    heading: 'Learn Today', 
    sub: 'Lead Tomorrow' 
  },
  { 
    id: 2, 
    bg: '/assets/hero-1.jpg', 
    heading: 'Master Your Skills', 
    sub: 'Unlock Your Potential' 
  },
  { 
    id: 3, 
    bg: '/assets/hero-2.jpg', 
    heading: 'Join Our Community', 
    sub: 'Grow Together' 
  }
];
const HeroSection = () => {
    const SWIPER_MODULES = [Autoplay, Navigation, Pagination];

    return (
      <section id="hero" className="position-relative">
        <Swiper
          modules={SWIPER_MODULES}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
        >
          {HERO_SLIDES.map(({ id, bg, heading, sub }) => (
            <SwiperSlide key={id}>
              <div
                className=" section d-flex align-items-center justify-content-center"
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  height: '100vh',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="overlay"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                ></div>
  
                <motion.div
                  className=" text-center  position-relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="display-4 fw-bold text-white">{heading}</h1>
                  <p className="lead mt-3 text-white">{sub}</p>
                  <a
                    href="/listModules"
                    className="btn btn-warning mt-4 px-4 py-2 shadow"
                  >
                    Explore Lessons
                  </a>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };
  export default HeroSection;