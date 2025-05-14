import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroSection from './landing_home/HeroSection';

import AboutSection from '../components/landing_home/AboutSection';
import CoursesSection from '../components/landing_home/CoursesSection';
import EduNovaFAQ from '../components/landing_home/FAQ';
import MetricsSection from './landing_home/MetricsSection';
import NewsletterSection from './landing_home/NewsletterSection';
import MentorsSection from './landing_home/MentorsSection';
import VideoSection from './landing_home/VideoSection';




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
 useEffect(()=>{
    document.title = "Home"
  },[])
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
     <MetricsSection />
      <div
      style={{
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <VideoSection/>
    </div>
 <MentorsSection />
     <CoursesSection lessons={lessons} />
      <NewsletterSection />
      <EduNovaFAQ />
    </main>
  );
}
