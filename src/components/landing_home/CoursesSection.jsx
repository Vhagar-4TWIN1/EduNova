import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Card from './Card';
import './CoursesSection.css';

const CoursesSection = ({ lessons = [] }) => {
  const items = Array.isArray(lessons)
    ? lessons
    : Array.isArray(lessons.data)
    ? lessons.data
    : [];

  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' });

  const getSpv = () => {
    const w = window.innerWidth;
    if (w >= 1200) return 4;
    if (w >= 992) return 3;
    if (w >= 576) return 2;
    return 1;
  };
  const [spv, setSpv] = useState(getSpv());
  useEffect(() => {
    const onResize = () => setSpv(getSpv());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const amt = track.clientWidth * 0.9;
    track.scrollBy({ left: dir==='next'? amt : -amt, behavior: 'smooth' });
  };

  return (
    <section className="edn-courses-section">
      <motion.h3
        className="edn-section-title"
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Available Lessons
      </motion.h3>

      {items.length > 0 ? (
        <div className="edn-carousel-wrapper">
          <motion.button
            className="edn-carousel-btn prev"
            onClick={() => scroll('prev')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous"
          >
            ‹
          </motion.button>

          <div
            className="edn-carousel-track"
            ref={trackRef}
            style={{ '--slides-per-view': spv }}
          >
            {items.map((lesson, i) => (
              <motion.div
                key={lesson._id || i}
                className="edn-carousel-slide"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Card
                  img={lesson.fileUrl || '/assets/img/default-lesson.jpg'}
                  badge={lesson.typeLesson || 'General'}
                  title={lesson.title || 'Untitled Lesson'}
                  description={lesson.content || 'No description available.'}
                  footer={
                    lesson.createdAt
                      ? new Date(lesson.createdAt).toLocaleDateString()
                      : 'Unknown'
                  }
                />
              </motion.div>
            ))}
          </div>

          <motion.button
            className="edn-carousel-btn next"
            onClick={() => scroll('next')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next"
          >
            ›
          </motion.button>
        </div>
      ) : (
        <p className="edn-no-lessons">No lessons available at the moment.</p>
      )}
    </section>
  );
};

export default CoursesSection;
