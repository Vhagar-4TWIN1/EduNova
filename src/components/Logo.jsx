// Logo.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ customStyle = {} }) => {
  const defaultStyle = {
    position: 'absolute',
    top: '-20px',
    left: '20px',
    zIndex: 10,
  };
  const mergedStyle = {
    ...defaultStyle,
    ...customStyle,
  };

  return (
    <motion.div
      style={mergedStyle}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <motion.img
        src="/src/assets/logolog.png"
        alt="Logo"
        style={{ 
          width: '210px', 
          height: 'auto',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
    </motion.div>
  );
};

export default Logo;
