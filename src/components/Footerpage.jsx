// Footer.jsx
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importez des icônes sociales

const Footerpage = () => {
  return (
    <footer style={{ 
      position: 'absolute', 
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
    }}>
      <div style={{ marginBottom: '10px' }}>
        {/* Liens utiles */}
        <a href="/privacy-policy" style={{ color: '#333', textDecoration: 'none', margin: '0 10px' }}>
          Politique de confidentialité
        </a>
        <a href="/terms-of-service" style={{ color: '#333', textDecoration: 'none', margin: '0 10px' }}>
          Conditions d'utilisation
        </a>
        <a href="/contact" style={{ color: '#333', textDecoration: 'none', margin: '0 10px' }}>
          Contact
        </a>
      </div>

      {/* Icônes sociales */}
      <div style={{ marginBottom: '10px' }}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#333', margin: '0 10px' }}>
          <FaFacebook size={20} />
        </a>
       
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#333', margin: '0 10px' }}>
          <FaInstagram size={20} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#333', margin: '0 10px' }}>
          <FaLinkedin size={20} />
        </a>
      </div>

      {/* Texte de copyright */}
      <p style={{ margin: '0', color: '#666' }}>
        &copy; 2023 Votre Entreprise. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footerpage;