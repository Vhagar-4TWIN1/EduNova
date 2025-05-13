import React from 'react';
import { motion } from 'framer-motion';
import './MentorsSection.css';

const mentors = [
  { id: 1, name: 'Dr. Leila Chaar', role: 'AI Mentor', photo: '/assets/mentors/leila.jpg' },
  { id: 2, name: 'Mr. Omar Saïd', role: 'Web Dev Mentor', photo: '/assets/mentors/omar.jpg' },
  { id: 3, name: 'Ms. Rita Khouri', role: 'Design Mentor', photo: '/assets/mentors/rita.jpg' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } },
};

export default function MentorsSection() {
  return (
    <section id="mentors" className="mentors-section">
      {/* decorative background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="mentors-header">
        <h2 className="section-title">Meet Our Mentors</h2>

      </div>

      <motion.div
        className="mentors-grid"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {mentors.map(({ id, name, role, photo }) => (
          <motion.div
            key={id}
            className="mentor-card"
            variants={card}
            whileHover={{ rotateX: -5, rotateY: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="avatar-wrapper">
              <img src={photo} alt={name} className="avatar" />
            </div>
            <h3 className="mentor-name">{name}</h3>
            <span className="role-badge">{role}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
