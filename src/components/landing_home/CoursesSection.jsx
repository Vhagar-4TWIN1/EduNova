import React, { useRef, useState, useEffect } from 'react';
import Card from './Card';
import './CoursesSection.css';

const CoursesSection = ({ lessons = [] }) => {
  const items = Array.isArray(lessons)
    ? lessons
    : Array.isArray(lessons.data)
      ? lessons.data
      : [];

  const trackRef = useRef(null);

  const getSlidesPerView = () => {
    const w = window.innerWidth;
    if (w >= 1200) return 4;
    if (w >= 992)  return 3;
    if (w >= 576)  return 2;
    return 1;
  };

  const [spv, setSpv] = useState(getSlidesPerView());

  useEffect(() => {
    const onResize = () => setSpv(getSlidesPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth;
    track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className=" py-5 bg-light ">
      <div className='h-100'>
        <h3 className="text-center mb-5  headline">Available Lessons</h3>

        {items.length > 0 ? (
          <div className="carousel-wrapper">
            <button
              className="carousel-btn prev"
              onClick={() => scroll('prev')}
              aria-label="Previous"
            >
              ‹
            </button>

            <div
              className="carousel-track"
              ref={trackRef}
              style={{ '--slides-per-view': spv }}
            >
              {items.map((lesson) => (
                <div className="carousel-slide" key={lesson._id || lesson.id}>
                  <Card
                    img={lesson.fileUrl || '/assets/img/default-lesson.jpg'}
                    badge={lesson.typeLesson || 'General'}
                    title={lesson.title || 'Untitled Lesson'}
                    description={lesson.content || 'No description available.'}
                    footer={
                      lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString()
                        : 'Date unknown'
                    }
                  />
                </div>
              ))}
            </div>

            <button
              className="carousel-btn next"
              onClick={() => scroll('next')}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        ) : (
          <p className="text-center text-muted">
            No lessons available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
