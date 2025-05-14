import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaChevronDown } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import './VideoSection.css';
import { useNavigate } from 'react-router-dom';

export default function VideoSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [isClean, setIsClean] = useState(false);
  const controls = useAnimation();
    const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!videoRef.current) return;
        if (e.isIntersecting) {
          videoRef.current.play(); 
          setPlaying(true);
          controls.start('visible');
        } else {
          videoRef.current.pause(); 
          setPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) obs.observe(videoRef.current);
    return () => obs.disconnect();
  }, [controls]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const scrollToCourses = () => {
    // instead of scrolling, go to /lesson
    navigate('/lesson');
  };

  // Toggle clean mode when user clicks/taps the video itself
  const handleVideoClick = () => setIsClean(c => !c);

  return (
    <section
      className={`video-section${isClean ? ' clean' : ''}`}
      aria-label="EduNova Hero Video"
    >
      {!isClean && <>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </>}

      <video
        ref={videoRef}
        className="bg-video"
        src="/assets/video.mp4"
        poster="/assets/video-poster.jpg"
        muted
        loop
        playsInline
        onClick={handleVideoClick}
      >
        Sorry, your browser doesn’t support embedded videos.
      </video>

      {!isClean && <>
        <div className="video-overlay" />

        <motion.div
          className="video-content"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1, y: 0,
              transition: { staggerChildren: 0.3, when: 'beforeChildren' }
            }
          }}
        >
          <motion.h1 variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.6}} }}>
            Your Learning<br/>Journey Starts Here
          </motion.h1>
          <motion.p variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.6,delay:0.3}} }}>
            Explore interactive courses, expert mentors, and real-world projects.
          </motion.p>
          <motion.div variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.6,delay:0.6}} }}>
            <button className="btn-primary" onClick={scrollToCourses}>Browse Courses</button>
            <button className="skip-intro" onClick={scrollToCourses}>Skip Intro</button>
          </motion.div>
        </motion.div>

        <button className="video-toggle" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? <FaPause /> : <FaPlay />}
        </button>

        <button className="scroll-down" onClick={scrollToCourses} aria-label="Scroll down">
          <FaChevronDown />
        </button>
      </>}
    </section>
  );
}
