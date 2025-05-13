import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/badge.css'; // Import your CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const UserBadges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);
  const [unachievedBadges, setUnachievedBadges] = useState([]);
  const navigate = useNavigate();
  fetch('http://localhost/moodle/webservice/rest/server.php?wstoken=7ccfd931c34a195d815957a0759ce508&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=oussamaawledsalem98724@gmail.com&moodlewsrestformat=json')
  .then(res => res.json())
  .then(data => {
    console.log(data); 
    if (data.users && data.users.length > 0) {
      const userId = data.users[0].id;
      console.log("User ID:", userId);  // Make sure the user ID is correct
      // Now proceed to fetch courses with this userId
      return fetch(`http://localhost/moodle/webservice/rest/server.php?wstoken=7ccfd931c34a195d815957a0759ce508&wsfunction=core_enrol_get_users_courses&userid=${userId}&moodlewsrestformat=json`);
    } else {
      throw new Error('User not found!');
    }
  })
  .then(res => res.json())
  .then(courses => {
    console.log("Courses:", courses);  // Courses will be logged here
  })
  .catch(error => {
    console.error("Error:", error);
  });


  const handleBadgeClick = (badgeId) => {
    console.log('Badge clicked:', badgeId);
    navigate(`/badge/${badgeId}`);
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await axios.get(`http://localhost:3000/api/users/badges/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        

        const notAchieved = await axios.get(`http://localhost:3000/api/users/unachieved-badges/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBadges(response.data);
        setUnachievedBadges(notAchieved.data);
      } catch (err) {
        setError('Error fetching badges');
        console.error(err);
      }
    };

    fetchBadges();
  }, []);

  return (
    <div className="container-fluid py-4">
  <h2 className="text-center mb-4 mt-24">User Badges</h2>
  {error && <p className="text-danger text-center">{error}</p>}

  <div className="row gx-3 gy-4">
    {[...badges, ...unachievedBadges].map((badge, index) => {
      const isAchieved = index < badges.length;

      return (
        <div
          key={badge._id}
          className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
          onClick={() => handleBadgeClick(badge._id)}
        >
          <div className={`card hover-card ${!isAchieved ? 'unachieved-card' : ''}`}>
            {!isAchieved && (
              <div className="lock-overlay">
                <i className="fas fa-lock" />
              </div>
            )}
            <img
              src={`http://localhost:3000/uploads/badges/${badge.image}`}
              alt={badge.title}
              className="card-img-top rounded-badge"
            />
            <div className="card-body">
              <h5 className="card-title">{badge.title}</h5>
              <p className="card-text">{badge.description}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
  );
};

export default UserBadges;
