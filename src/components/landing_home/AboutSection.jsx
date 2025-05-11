import { motion } from 'framer-motion';
import './about.css';

// Animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// EduNova-specific selling points
const points = [
  'Hands-on courses built by industry experts',
  'One-on-one mentorship tailored to your journey',
  'Custom learning paths for your career goals',
  'Certification preparation and portfolio reviews',
];

const AboutSection = () => {
  return (
    <section id="about" className="about-section section py-5">
      <motion.div
        className=" position-relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        style={{ padding: ' 0 2rem' }}
      >
        <div className="row gy-5 align-items-center">
          {/* Text & Features */}
          <div className="col-lg-6">
            <motion.h2
              className="headline mb-3"
              variants={itemVariants}
            >
              Learn. Build. Succeed with EduNova
            </motion.h2>

            <motion.p className="subtitle mb-4" variants={itemVariants}>
              EduNova empowers you to master in-demand tech skills through
              project-based learning, expert guidance, and a roadmap built just
              for you.
            </motion.p>

            <motion.ul className="list-unstyled mb-4" variants={containerVariants}>
              {points.map((text, idx) => (
                <motion.li
                  key={idx}
                  className="d-flex align-items-start mb-3 feature-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <i className="bi bi-check-circle-fill text-gradient me-3 fs-4" />
                  <span>{text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants}>
              <button className="btn btn-gradient btn-lg">
                Try EduNova Free for 7 Days
              </button>
            </motion.div>
          </div>

          {/* Illustration */}
          <div className="col-lg-6">
            <motion.img
              src="/assets/img/about.jpg"
              alt="Students learning on EduNova"
              className="img-fluid rounded shadow-lg image-hero"
              variants={itemVariants}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
