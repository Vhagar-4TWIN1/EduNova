import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroSection from './landing_home/HeroSection';

import AboutSection from '../components/landing_home/AboutSection';
import CoursesSection from '../components/landing_home/CoursesSection';
import EduNovaFAQ from './landing_home/faq';


export default function Home() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  const handleTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('token', token);

      Object.entries(payload).forEach(([key, value]) =>
        localStorage.setItem(key, value),
      );

      navigate('/home', { replace: true });
    } catch (error) {
      console.error('JWT decode error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Fetch lessons and users in parallel
      const [lessonsResponse] = await Promise.all([
        axios.get('/api/lessons', authHeader),
      ]);

      setLessons(lessonsResponse.data);
      console.log("lessonsResponse:", lessonsResponse);

    
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  useEffect(() => {
    handleTokenFromURL();
    fetchData();
  }, []);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <div
      style={{
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <video
        src="/assets/video.mp4"
        controls
        muted
        loop
        style={{
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
        }}
      >
        Sorry, your browser doesn’t support embedded videos.
      </video>
    </div>

      <CoursesSection lessons={lessons} />
    
      <EduNovaFAQ />
    </main>
  );
}
