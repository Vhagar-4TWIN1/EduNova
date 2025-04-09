import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BadgeDetail = () => {
  const  badgeId  = useParams(); // Get badgeId from the URL
  const [badgeDetail, setBadgeDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadgeDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token: ", token);
        console.log("Badge ID: ", badgeId.id);
        const response = await axios.get(`http://localhost:3000/api/badges/${badgeId.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadgeDetail(response.data.badge);
        console.log("Badge Detail:", badgeDetail);
      } catch (err) {
        setError('Error fetching badge details');
        console.error(err);
      }
    };

    fetchBadgeDetail();
  }, [badgeId]);

  return (
    <div className="container mt-5" style={{ maxWidth: '1080px' }}>
      <h2 className="text-center mb-4">Badge Details</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {badgeDetail ? (
        <div className="card shadow-lg p-5 rounded-lg" style={{ maxWidth: '1920px', margin: '0 auto' }}>
          <div className="text-center mb-1">
            <img
              src={`http://localhost:3000/uploads/badges/${badgeDetail.image}`}
              alt={badgeDetail.title}
              className="rounded-circle border border-1 border-primary"
              style={{ width: '500px', height: '500px', objectFit: 'cover' }}
            />
          </div>
          <div className="card-body text-center">
            <h5 className="card-title">{badgeDetail.title}</h5>
            <p className="card-text">{badgeDetail.description}</p>
            <div className="badge-stats mt-4">
              <p><strong>Category:</strong> {badgeDetail.category}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default BadgeDetail;
