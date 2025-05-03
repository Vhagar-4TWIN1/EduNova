import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importez des icônes sociales

const Footerpage = () => {
  return (
    <footer style={{ 
      position: 'fixed',  // Garder le footer collé au bas
      bottom: '0', 
      left: '0', 
      right: '0', 
      backgroundColor: '#f8f9fa', // Couleur de fond légère
      padding: '20px', 
      textAlign: 'center', 
      color: '#333', // Couleur de texte plus douce
      fontSize: '14px', 
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)', // Ombre portée
      borderTop: '1px solid #e0e0e0', // Bordure supérieure
      zIndex: '1000',  // Assurer que le footer soit au-dessus du contenu
    }}>
      <div style={{ marginBottom: '10px' }}>
        {/* Liens utiles */}
        <a href="/privacy-policy" style={linkStyle}>
        Privacy Policy
        </a>
        <a href="/terms-of-service" style={linkStyle}>
        Terms of Use
        </a>
        <a href="/contact" style={linkStyle}>
          Contact
        </a>
      </div>

      {/* Icônes sociales */}
     
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px',       // space between icons 
         marginBottom: '10px' 
        }} 
      > 
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}> 
         <FaFacebook size={20} /> 
      </a> 
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}> 
          <FaInstagram size={20} /> 
        </a> 
       <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyle}> 
          <FaLinkedin size={20} /> 
        </a> 
      </div>

      {/* Texte de copyright */}
      <p style={{ margin: '0', color: '#666' }}>
        &copy; 2025 Vhagar..
      </p>
    </footer>
  );
};

// Styles réutilisables pour les liens
const linkStyle = {
  color: '#333',
  textDecoration: 'none',
  margin: '0 10px',
  transition: 'color 0.3s',
};

const iconLinkStyle = {
  color: '#333',
  margin: '0 10px',
  transition: 'color 0.3s',
};

export default Footerpage;
