// AboutSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './about.css';

const points = [
  'Hands-on courses built by industry experts',
  'One-on-one mentorship tailored to your journey',
  'Custom learning paths for your career goals',
  'Certification prep & portfolio reviews',
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
  return (
    <section id="about" className="edn-about-wrapper">
      <div className="edn-shape edn-shape--circle" />
      <div className="edn-shape edn-shape--blob" />

      <div className="edn-content-grid">
        {/* Text card */}
        <motion.div
          className="edn-text-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <motion.h2 className="edn-headline" variants={item}>
            Learn. Build. Succeed with EduNova
          </motion.h2>

          <motion.p className="edn-subtitle" variants={item}>
            <span className="edn-highlight">EduNova</span> empowers you to master
            in-demand tech skills through project-based learning, expert guidance,
            and a personalized roadmap.
          </motion.p>

          <motion.ul className="edn-features-list" variants={container}>
            {points.map((text, i) => (
              <motion.li
                key={i}
                className="edn-feature-item"
                variants={item}
                whileHover={{ x: 4 }}
              >
                <i className="bi bi-check-circle-fill edn-feature-icon" />
                <span className="edn-feature-text">{text}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="edn-cta-wrap" variants={item}>
            <button className="edn-btn">
              Join Now
            </button>
          </motion.div>
        </motion.div>

        {/* Egg-shape image */}
        <motion.div
          className="edn-image-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <img
            src="/assets/img/about.jpg"
            alt="Students learning"
            className="edn-image"
          />
        </motion.div>
      </div>
    </section>
  );
}
