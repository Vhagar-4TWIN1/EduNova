import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/badge.css'; // Import your CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation

const UserBadges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);
  const [unachievedBadges, setUnachievedBadges] = useState([]);
  const navigate = useNavigate(); 
    const handleBadgeClick = (badgeId) => {
        console.log('Badge clicked:', badgeId);  
    navigate(`/badge/${badgeId}`);   
  };
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("this is it " + token);
        const userId = localStorage.getItem('userId');
        console.log("this is my id " + userId);
        const response = await axios.get(`http://localhost:3000/api/users/badges/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header for authentication
          },
        });
        const notAchieved = await axios.get(`http://localhost:3000/api/users/unachieved-badges/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Send token in header for authentication
            },
            });
          
        setBadges(response.data);
        setUnachievedBadges(notAchieved.data);
      
        notAchieved.data.forEach((badge) => {
            console.log(badge.image);
          });
          
      } catch (err) {
        setError('Error fetching badges');
        console.error(err);
      }
    };

    fetchBadges();
  }, []); // Fetch badges on component mount

  return (
    <div className="container">
      <h2>User Badges</h2>
      {error && <p className="text-danger">{error}</p>}
      {(
        <div className="container">
        <div className="row">
          {/* Render Achieved Badges */}
          {badges.map((badge) => (
            <div key={badge._id } className="col-12 col-md-3 mb-4" onClick={() => handleBadgeClick(badge._id)}>
                
              <div className="card hover-card">
                <img
                  src={`http://localhost:3000/uploads/badges/${badge.image}`}
                  alt={badge.title}
                  className="card-img-top rounded-badge"
                />
                <div className="card-body">
                  <h5 className="card-title">{badge.title}</h5>
                  <div className="card-description">
                    <p className="card-text">{badge.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Render Unachieved Badges */}
          {unachievedBadges.map((badge) => (
            <div key={badge._id} className="col-12 col-md-3 mb-4" onClick={() => handleBadgeClick(badge._id)}>
              <div className="card hover-card unachieved-card">
                <div className="lock-overlay">
    <i className="fas fa-lock" />
  </div>
                <img
                src={`http://localhost:3000/uploads/badges/${badge.image}`} 
                  alt={badge.title}
                  className="card-img-top rounded-badge"
                />
                <div className="card-body">
                  <h5 className="card-title">{badge.title}</h5>
                  <div className="card-description">
                    <p className="card-text">{badge.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

      
  );
};

export default UserBadges;
