// Logo.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Importez motion pour les animations

const Logo = () => {
  return (
    <motion.div
      style={{ 
        position: 'absolute', 
        top: '-90px', // Position verticale en haut
        left: '20px', // Position horizontale à droite
        zIndex: 10, // Assurez-vous que le logo est au-dessus des autres éléments
      }}
      initial={{ opacity: 0, y: -50 }} // Animation initiale : invisible et décalée vers le haut
      animate={{ opacity: 1, y: 0 }} // Animation finale : visible et à sa position normale
      transition={{ duration: 1, ease: 'easeOut' }} // Durée et type d'animation
    >
      {/* Logo avec animation de survol */}
      <motion.img
        src="/src/assets/logolog.png"
        alt="Logo"
        style={{ 
          width: '210px', 
          height: 'auto', 
          cursor: 'pointer', // Change le curseur au survol
        }}
        whileHover={{ scale: 1.1, rotate: 5 }} // Effet de survol : zoom et rotation
        transition={{ type: 'spring', stiffness: 300 }} // Animation fluide au survol
      />
    </motion.div>
  );
};

export default Logo;