import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';
import { EduFeatures, SecurityFeatures, SocialFeatures } from '../constants';
import { Tilt } from 'react-tilt';
import {
  FaGraduationCap, FaUserShield, FaUsers, FaGamepad, FaBookReader,
  FaChartLine, FaHeadphones, FaBrain, FaCheckCircle, FaCommentDots
} from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const FeatureCard = ({ index, title, icon, description }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card hover:scale-[1.02] transition-transform"
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <div className="text-4xl text-white mb-4">
          {icon}
        </div>
        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
        <p className="text-secondary text-[14px] text-center mt-2">
          {description}
        </p>
      </div>
    </motion.div>
  </Tilt>
);



const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        EduNova is a revolutionary personalized education platform that transforms learning through AI-powered features, 
        emotional tracking, and interactive tools. Designed for both students and teachers, it provides a seamless, 
        secure, and engaging educational experience tailored to your needs.
      </motion.p>

      {/* Key Features Section */}
      <div className="mt-20">
        <motion.div variants={textVariant()}>
          <h2 className={styles.sectionHeadText}>Key Features</h2>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard 
            index={1}
            title="Personalized Learning"
            icon={<FaGraduationCap />}
            description="AI-curated learning paths based on your performance, preferences, and goals"
          />
          <FeatureCard 
            index={2}
            title="Teacher Verification"
            icon={<FaUserShield />}
            description="Secure attestation verification for teachers to ensure qualified educators"
          />
          <FeatureCard 
            index={3}
            title="Interactive Community"
            icon={<FaUsers />}
            description="Connect with teachers and peers through forums and real-time video collaboration"
          />
        </div>
      </div>

      {/* Tabbed Detailed Features */}
      <div className="mt-20">
        <motion.div variants={textVariant()}>
          <h3 className={styles.sectionSubText}>Comprehensive Tools</h3>
        </motion.div>

        <Tabs className="mt-10">
          <TabList className="flex flex-wrap gap-4 text-white">
            <Tab className="bg-tertiary px-4 py-2 rounded cursor-pointer hover:bg-purple-500">📚 Education</Tab>
            <Tab className="bg-tertiary px-4 py-2 rounded cursor-pointer hover:bg-purple-500">💬 Engagement</Tab>
          </TabList>

          <TabPanel>
            <div className="bg-tertiary p-8 rounded-2xl mt-6">
              <div className="flex items-center mb-6">
                <FaBookReader className="text-3xl mr-4 text-white" />
                <h4 className="text-white font-bold text-xl">Education Features</h4>
              </div>
              <ul className="space-y-4">
                {EduFeatures.map((feature, index) => (
                  <li key={`edu-feature-${index}`} className="flex items-start">
                    <FaCheckCircle className="text-green-400 mr-2 mt-1" />
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="bg-tertiary p-8 rounded-2xl mt-6">
              <div className="flex items-center mb-6">
                <FaGamepad className="text-3xl mr-4 text-white" />
                <h4 className="text-white font-bold text-xl">Engagement Features</h4>
              </div>
              <ul className="space-y-4">
                {SocialFeatures.map((feature, index) => (
                  <li key={`social-feature-${index}`} className="flex items-start">
                    <FaCommentDots className="text-blue-300 mr-2 mt-1" />
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Security Section */}
      <div className="mt-20">
        <motion.div variants={textVariant()}>
          <h2 className={styles.sectionHeadText}>Security & Privacy</h2>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-3 gap-10">
          {SecurityFeatures.map((feature, index) => (
            <FeatureCard 
              key={`security-${index}`}
              index={index}
              {...feature}
            />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <motion.h3
          className={styles.sectionSubText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to transform your learning experience?
        </motion.h3>
        <motion.button
          className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          Join EduNova Today →
        </motion.button>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
