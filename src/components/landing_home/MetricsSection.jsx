// MetricsSection.jsx
import React, { useEffect, useState, useRef } from 'react';
import { FaGraduationCap, FaCheckCircle, FaClock } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import './MetricsSection.css';

const metrics = [
  { id: 1, label: 'Learners',          value: 12000, icon: <FaGraduationCap /> },
  { id: 2, label: 'Courses Completed', value: 35000, icon: <FaCheckCircle /> },
  { id: 3, label: 'Hours Content',     value: 5000,  icon: <FaClock /> },
];

function useInView(threshold = 0.3) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const CountUp = ({ end, inView }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / 100);
    const id = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(id);
      } else setCount(start);
    }, 15);
    return () => clearInterval(id);
  }, [end, inView]);
  return <span>{count.toLocaleString()}</span>;
};

export default function MetricsSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <section id="metrics" className="metrics-section" ref={ref}>
      {/* Decorative shapes */}
      <div className="shape shape-1" />
      <div className="shape shape-2" />

      <div className="metrics-header">
        <h2>Our Impact</h2>
        <p>Empowering learners across the globe</p>
      </div>

      <div className="metrics-container">
        {metrics.map(({ id, label, value, icon }) => (
          <motion.div
            key={id}
            className="metric-card"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: id * 0.2 }}
          >
            <div className="icon-wrapper">
              {icon}
            </div>
            <h3><CountUp end={value} inView={inView} /></h3>
            <p>{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
