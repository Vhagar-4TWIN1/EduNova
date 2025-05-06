import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MotivationalAvatar = () => {
  const [avatar, setAvatar] = useState('');
  const [motivationalQuotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('');
  const navigate = useNavigate();

  // Charger les avatars et citations au montage du composant
  useEffect(() => {
    // Liste d'avatars gratuits (URLs vers des images libres de droits)
    const avatars = [
      'https://img.icons8.com/color/96/000000/mental-health.png',
      'https://img.icons8.com/color/96/000000/medal2.png',
      'https://img.icons8.com/color/96/000000/positive-dynamic.png'
    ];

    // Citations motivantes
    const quotes = [
      "Chaque expert était d'abord un débutant!",
      "Le succès c'est tomber 7 fois, se relever 8!",
      "Tu progresses à chaque instant!"
    ];

    setQuotes(quotes);
    setAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Changer de citation toutes les 30 secondes
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <img 
        src={avatar} 
        alt="Avatar motivationnel" 
        style={{
          width: '60px',
          height: '60px',
          marginRight: '15px'
        }}
      />
      <div>
        <p style={{
          margin: 0,
          fontWeight: 'bold',
          color: '#333'
        }}>{currentQuote}</p>
        <small style={{ color: '#666' }}>Tu es sur la bonne voie!</small>
      </div>
    </div>
  );
};

export default MotivationalAvatar;