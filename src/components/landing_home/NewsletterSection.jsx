// NewsletterSection.jsx
import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './NewsletterSection.css';

const rotatingKeywords = ['tips', 'challenges', 'news', 'updates'];

export default function NewsletterSection() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through rotatingKeywords every 3s
  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentIndex(i => (i + 1) % rotatingKeywords.length),
      3000
    );
    return () => clearInterval(intervalId);
  }, []);

  const handleSubscribe = e => {
    e.preventDefault();
    // Your subscribe logic here...
    setIsSubscribed(true);
  };

  // inline style to force all text/icons white
  const inlineTextStyle = { color: '#fff', fill: '#fff' };

  return (
    <section className="newsletter-section" style={inlineTextStyle}>
      <div className="particles" />

      <motion.div
        className="newsletter-content"
        style={inlineTextStyle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="headline" style={inlineTextStyle}>
          Get weekly{' '}
          <span className="rotate" style={inlineTextStyle}>
            {rotatingKeywords[currentIndex]}
          </span>
          {' '}from EduNova
        </h2>

        {isSubscribed ? (
          <motion.div
            className="thankyou"
            style={inlineTextStyle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            🎉 You’re in! Check your inbox.
          </motion.div>
        ) : (
          <motion.form
            className="form-card"
            style={inlineTextStyle}
            onSubmit={handleSubscribe}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <input
              type="email"
              placeholder="you@example.com"
              value={emailAddress}
              onChange={e => setEmailAddress(e.target.value)}
              required
              style={{ ...inlineTextStyle, background: 'transparent' }}
            />
            <button
              type="submit"
              disabled={!emailAddress}
              style={{ color: '#fff' }}
            >
              <FaPaperPlane style={{ color: '#fff' }} />
            </button>
          </motion.form>
        )}
      </motion.div>
    </section>
  );
}
